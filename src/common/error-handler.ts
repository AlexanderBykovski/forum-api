import type { NextFunction, Request, Response } from "express";
import { ApiError, isInvalidJsonBody, isUniqueViolation } from "./errors.js";

export function createErrorHandler() {
    return function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
        if (res.headersSent) {
            next(err);
            return;
        }

        if (err instanceof ApiError) {
            res.status(err.status).json({
                message: err.code,
                ...(err.details ? { details: err.details } : {}),
            });
            return;
        }

        if (isInvalidJsonBody(err)) {
            res.status(400).json({
                message: "INVALID_JSON_BODY"
            });
            return;
        }

        if (isUniqueViolation(err)) {
            res.status(409).json({
                message: "CONFLICT"
            });
            return;
        }

        console.error("Unhandled error:", err);
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        });
    };
}
