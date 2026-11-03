import type {Request, Response} from "express";
import userRoutes from "../modules/users/user.routes";

export const routes = async (
  req: Request,
  res: Response
): Promise<boolean> => {
  const userHandled = await userRoutes(req, res);

  if (userHandled) {
    return true;
  }

  return false;
};
