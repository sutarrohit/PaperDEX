import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers to forward errors to Express error middleware.
 * Ensures type safety and proper error propagation.
 */
const catchAsync = (myFn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
    return (req, res, next) => {
        myFn(req, res, next).catch(next);
    };
};

export { catchAsync };
