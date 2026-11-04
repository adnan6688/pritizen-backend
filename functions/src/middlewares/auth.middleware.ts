import type {NextFunction, Request, Response} from "express";
import {auth} from "../config/firebase";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.errorResponse(401, "Unauthorized");
      return;
    }

    const token = authorization.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: decodedToken.role || "customer",
    };

    next();
  } catch (error) {
    res.errorResponse(401, "Unauthorized", error);
  }
};
