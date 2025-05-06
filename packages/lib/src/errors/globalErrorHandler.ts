import { Request, Response, NextFunction } from "express";

// Define the extended error type
type CustomError = Error & {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  path?: string;
  value?: string;
  name?: string;
};

const sendErrorDev = (err: CustomError, req: Request, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorPro = (err: CustomError, req: Request, res: Response): void => {
  let error = err;

  if (error?.isOperational) {
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || 500,
      status: error.status || "error",
      message: error.message,
    });
  } else {
    console.log("error", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    sendErrorPro(err, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};

export { globalErrorHandler };
