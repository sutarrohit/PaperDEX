import { Request, Response } from "express";

const healthCheck = (message: string) => {
    return (req: Request, res: Response) => {
        res.status(200).json({
            status: "success",
            message: message,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    };
};

export { healthCheck };
