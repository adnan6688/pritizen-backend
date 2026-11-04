import {Timestamp} from "firebase-admin/firestore";
import {auth} from "../../config/firebase";
// eslint-disable-next-line import/no-named-as-default
import env from "../../config/env";
import {AppError} from "../../errors/AppError";
import {LoginUserInput, RegisterUserInput} from "./user.validation";
import {UserModel} from "./user.model";
import {userRepository} from "./user.repository";

interface LoginUserResult {
  user: UserModel;
  token: string;
  refreshToken: string;
}

export const registerUser = async (
  input: RegisterUserInput
): Promise<UserModel> => {
  const email = input.email.trim().toLowerCase();

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const firebaseUser = await auth.createUser({
    email,
    password: input.password,
    displayName: input.name,
  });

  try {
    const now = Timestamp.now();

    const userData: UserModel = {
      uid: firebaseUser.uid,
      name: input.name,
      email,
      photoURL: null,
      role: "customer",
      status: "active",
      emailVerified: firebaseUser.emailVerified,
      createdAt: now,
      updatedAt: now,
    };

    await userRepository.create(userData);

    return userData;
  } catch (error) {
    await auth.deleteUser(firebaseUser.uid);

    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserModel> => {
  const user = await userRepository.findById(uid);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const loginUser = async (
  input: LoginUserInput
): Promise<LoginUserResult> => {
  const email = input.email.trim().toLowerCase();
  const apiKey = env.FIREBASE_WEB_API_KEY ??
    env.FIREBASE_API_KEY ??
    env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new AppError(
      // eslint-disable-next-line max-len
      "Firebase API key is not configured. Set FIREBASE_WEB_API_KEY in your environment.",
      500
    );
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: input.password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json() as {
    idToken?: string;
    refreshToken?: string;
    localId?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || !data.idToken || !data.localId) {
    const message = data.error?.message;

    // eslint-disable-next-line max-len
    if (message === "EMAIL_NOT_FOUND" || message === "INVALID_PASSWORD" || message === "INVALID_LOGIN_CREDENTIALS") {
      throw new AppError("Invalid email or password", 401);
    }

    if (message === "TOO_MANY_ATTEMPTS_TRY_LATER") {
      throw new AppError("Too many attempts. Please try again later", 429);
    }

    throw new AppError("Login failed", 401);
  }

  const decodedToken = await auth.verifyIdToken(data.idToken);
  const user = await userRepository.findById(decodedToken.uid);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.status !== "active") {
    throw new AppError("Your account is inactive", 403);
  }

  return {
    user,
    token: data.idToken,
    refreshToken: data.refreshToken || "",
  };
};
