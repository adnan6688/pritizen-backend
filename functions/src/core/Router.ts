import type {NextFunction, Request, Response} from "express";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

type RouteEntry = {
  method: string;
  path: string;
  handlers: RouteHandler[];
};

export class Router {
  private readonly routes: RouteEntry[] = [];

  private register(
    method: string,
    path: string,
    ...handlers: RouteHandler[]
  ): void {
    this.routes.push({method, path, handlers});
  }

  public get(path: string, ...handlers: RouteHandler[]): void {
    this.register("GET", path, ...handlers);
  }

  public post(path: string, ...handlers: RouteHandler[]): void {
    this.register("POST", path, ...handlers);
  }

  public put(path: string, ...handlers: RouteHandler[]): void {
    this.register("PUT", path, ...handlers);
  }

  public patch(path: string, ...handlers: RouteHandler[]): void {
    this.register("PATCH", path, ...handlers);
  }

  public delete(path: string, ...handlers: RouteHandler[]): void {
    this.register("DELETE", path, ...handlers);
  }

  public async dispatch(req: Request, res: Response): Promise<boolean> {
    const rawPath = (req.originalUrl || req.url || "").split("?")[0];
    const requestPath = rawPath.replace(/^\/api(?=\/|$)/, "") || "/";
    const requestMethod = req.method.toUpperCase();

    const route = this.routes.find((entry) => {
      if (entry.method !== requestMethod) {
        return false;
      }

      return this.matchesPath(entry.path, requestPath);
    });

    if (!route) {
      return false;
    }

    let index = 0;

    const next: NextFunction = async (): Promise<void> => {
      const handler = route.handlers[index++];

      if (!handler) {
        return;
      }

      await handler(req, res, next);
    };

    await next();

    return true;
  }

  private matchesPath(routePath: string, requestPath: string): boolean {
    const routeSegments = routePath.split("/").filter(Boolean);
    const requestSegments = requestPath.split("/").filter(Boolean);

    if (routeSegments.length !== requestSegments.length) {
      return false;
    }

    return routeSegments.every((segment, index) => {
      if (segment.startsWith(":")) {
        return true;
      }

      return segment === requestSegments[index];
    });
  }
}
