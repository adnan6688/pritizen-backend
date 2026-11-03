import {Timestamp} from "firebase-admin/firestore";
import {auth} from "../../config/firebase";
import {AppError} from "../../errors/AppError";
import {RegisterUserInput} from "./user.validation";
import {UserModel} from "./user.model";
import {userRepository} from "./user.repository";

class UserService {
  async register(input: RegisterUserInput): Promise<UserModel> {
    const email = input.email.trim().toLowerCase();

    // Check existing user
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // Create Firebase Authentication user
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

      // Save user profile in Firestore
      await userRepository.create(userData);

      return userData;
    } catch (error) {
      // Rollback Firebase Authentication user
      await auth.deleteUser(firebaseUser.uid);

      throw error;
    }
  }

  async getProfile(uid: string): Promise<UserModel> {
    const user = await userRepository.findById(uid);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export const userService = new UserService();
