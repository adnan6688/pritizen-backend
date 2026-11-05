import type {Request, Response} from "express";
import {Router} from "../../core/Router";
import {requireAuth} from "../../middlewares/auth.middleware";
import {login, me, profile, register, updateProfile} from "./user.controller";

const router = new Router();

router.post("/users/register", register);
router.post("/users/login", login);
router.get("/users/me", requireAuth, me);
router.get("/users/:uid", requireAuth, profile);
router.patch("/users/profile", requireAuth, updateProfile);

const userRoutes = async (
  req: Request,
  res: Response
): Promise<boolean> => router.dispatch(req, res);

export default userRoutes;
