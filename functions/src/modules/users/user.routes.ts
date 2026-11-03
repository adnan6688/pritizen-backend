import type {Request, Response} from "express";
import {Router} from "../../core/Router";
import {requireAuth} from "../../middlewares/auth.middleware";
import {userController} from "./user.controller";

const router = new Router();

router.post("/users/register", userController.register);
router.get("/users/:uid", requireAuth, userController.profile);

const userRoutes = async (
  req: Request,
  res: Response
): Promise<boolean> => router.dispatch(req, res);

export default userRoutes;
