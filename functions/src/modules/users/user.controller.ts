import type {Request, Response} from "express";
import {userService} from "./user.service";
import {
  registerUserSchema,
} from "./user.validation";

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    const input = registerUserSchema.parse(req.body);

    const user = await userService.register(input);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async profile(req: Request, res: Response): Promise<void> {
    const uid = req.params.uid as string;

    const user = await userService.getProfile(uid);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  }
}

export const userController = new UserController();
