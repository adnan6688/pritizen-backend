import type {Request, Response} from "express";
import {getUserProfile, loginUser, registerUser} from "./user.service";
import {loginUserSchema, registerUserSchema} from "./user.validation";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = registerUserSchema.parse(req.body);

  const user = await registerUser(input);

  res.successResponse(201, "User registered successfully", user);
};

export const profile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const uid = req.params.uid as string;

  const user = await getUserProfile(uid);

  res.successResponse(200, "User profile fetched successfully", user);
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const input = loginUserSchema.parse(req.body);

  const result = await loginUser(input);

  res.successResponse(200, "Login successful", {
    user: result.user,
    token: result.token,
    refreshToken: result.refreshToken,
  });
};
