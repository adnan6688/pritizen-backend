import type {Request, Response} from "express";
// eslint-disable-next-line max-len
import {getUserProfile, loginUser, registerUser, updateUserProfile} from "./user.service";
// eslint-disable-next-line max-len
import {loginUserSchema, registerUserSchema, updateUserProfileSchema} from "./user.validation";

// eslint-disable-next-line max-len
const formatUserForResponse = <T extends { createdAt?: unknown; updatedAt?: unknown }>(user: T): T => {
  const toIsoDate = (value: unknown): unknown => {
    if (value instanceof Date) {
      return value.toISOString();
    }

    // eslint-disable-next-line max-len
    if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }

    return value;
  };

  return {
    ...user,
    createdAt: toIsoDate(user.createdAt),
    updatedAt: toIsoDate(user.updatedAt),
  } as T;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const input = registerUserSchema.parse(req.body);

  const user = formatUserForResponse(await registerUser(input));

  res.successResponse(201, "User registered successfully", user);
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;

  if (!uid) {
    res.errorResponse(401, "Unauthorized");
    return;
  }

  const user = formatUserForResponse(await getUserProfile(uid));

  res.successResponse(200, "User profile fetched successfully", user);
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;

  if (!uid) {
    res.errorResponse(401, "Unauthorized");
    return;
  }

  const user = formatUserForResponse(await getUserProfile(uid));

  res.successResponse(200, "User profile fetched successfully", user);
};

// eslint-disable-next-line max-len
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;

  if (!uid) {
    res.errorResponse(401, "Unauthorized");
    return;
  }

  const input = updateUserProfileSchema.parse(req.body);
  const user = formatUserForResponse(await updateUserProfile(uid, input));

  res.successResponse(200, "User profile updated successfully", user);
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = loginUserSchema.parse(req.body);

  const result = await loginUser(input);

  res.successResponse(200, "Login successful", {
    user: formatUserForResponse(result.user),
    token: result.token,
    refreshToken: result.refreshToken,
  });
};
