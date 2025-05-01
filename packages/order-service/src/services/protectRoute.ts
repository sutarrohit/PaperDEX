import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError, catchAsync } from "@paperdex/lib";

import { auth, Session } from "@paperdex/user-service";
import { fromNodeHeaders } from "@paperdex/user-service/fromNodeHeaders";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: Session;
    }
  }
}

export const protectedRoute: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) throw new AppError("Unauthorized access. Please log in to continue.", 401);

    // Attach the session to req.user
    req.user = session;
    next();
  },
);
