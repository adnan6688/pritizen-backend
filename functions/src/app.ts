import type {Request, Response} from "express";
import {routes} from "./routes";
import {errorHandler} from "./errors/errorHandler";

export const app = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const handled = await routes(req, res);

    if (!handled) {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
