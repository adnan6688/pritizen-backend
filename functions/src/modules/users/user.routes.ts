import type {Request, Response} from "express";
import {Router} from "../../core/Router";
import {requireAuth} from "../../middlewares/auth.middleware";
import {login, profile, register} from "./user.controller";

const router = new Router();

router.post("/users/register", register);
router.post("/users/login", login);
router.get("/users/:uid", requireAuth, profile);

const userRoutes = async (
  req: Request,
  res: Response
): Promise<boolean> => router.dispatch(req, res);

export default userRoutes;
