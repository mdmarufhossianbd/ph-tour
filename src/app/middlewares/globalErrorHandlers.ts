import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHandler/AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandlers = (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = `Something went wrong! ${error.message}`

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        error: error,
        stack: envVars.NODE_ENV === "development" ? error.stack : undefined,
    })
}