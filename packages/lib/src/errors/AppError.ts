class AppError extends Error {
    statusCode: number;
    status: string;

    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
        this.isOperational = true;

        // Return where error actually happing
        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };
