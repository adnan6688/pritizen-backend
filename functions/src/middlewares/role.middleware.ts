import type {NextFunction, Request, Response} from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.errorResponse(401, "Unauthorized");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.errorResponse(403, "Forbidden");
      return;
    }

    next();
  };
};
