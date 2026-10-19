export class ApiError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: string[];

    constructor(status: number, code: string, details?: string[]) {
        super(code);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export class BadRequestError extends ApiError {
    constructor(code: string) {
        super(400, code);
    }
}

export class NotFoundError extends ApiError {
    constructor(code: string) {
        super(404, code);
    }
}

export class ConflictError extends ApiError {
    constructor(code: string) {
        super(409, code);
    }
}

export class UnprocessableEntityError extends ApiError {
    constructor(details: string[]) {
        super(422, 'VALIDATION_FAILED', details);
    }
}

export function isUniqueViolation(error: unknown): boolean {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const candidate = error as { sqlState?: string; code?: string };
    return candidate.sqlState === "23505" || candidate.code === "P2002";
}

export function isInvalidJsonBody(error: unknown): boolean {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const candidate = error as { type?: string; status?: number; statusCode?: number };
    return candidate.type === "entity.parse.failed" && (candidate.status === 400 || candidate.statusCode === 400);
}
