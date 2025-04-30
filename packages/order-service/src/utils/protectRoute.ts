import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError, catchAsync } from "@paperdex/lib";

import { auth } from "@paperdex/user-service";
import { fromNodeHeaders } from "@paperdex/user-service/fromNodeHeaders";

export const protectedRoute: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) throw new AppError("Unauthorized access. Please log in to continue.", 401);
    next();
});
