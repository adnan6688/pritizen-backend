import type {Request, Response} from "express";
import {routes} from "./routes";
import {errorHandler} from "./errors/errorHandler";
import {attachResponseHelpers} from "./utils/response";

export const app = async (
  req: Request,
  res: Response
): Promise<void> => {
  attachResponseHelpers(res);

  try {
    const handled = await routes(req, res);

    if (!handled) {
      res.errorResponse(404, "Route not found");
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
