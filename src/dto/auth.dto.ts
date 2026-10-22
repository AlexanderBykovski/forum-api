export interface AuthCredentialsDto {
    email: string;
    password: string;
}

export type ValidationResult<T> =
    | { ok: true; data: T }
    | { ok: false; errors: string[] };

const ALLOWED_FIELDS = ["email", "password"];
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthCredentials(body: unknown): ValidationResult<AuthCredentialsDto> {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return { ok: false, errors: ["BODY_MUST_BE_AN_OBJECT"] };
    }

    const record = body as Record<string, unknown>;
    const errors: string[] = [];

    for (const key of Object.keys(record)) {
        if (!ALLOWED_FIELDS.includes(key)) {
            errors.push(`UNKNOWN_FIELD_${key}`);
        }
    }

    const email = record["email"];
    if (typeof email !== "string" || email.trim().length === 0) {
        errors.push("EMAIL_IS_REQUIRED");
    } else if (email.trim().length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email.trim())) {
        errors.push("EMAIL_IS_INVALID");
    }

    const password = record["password"];
    if (typeof password !== "string" || password.length === 0) {
        errors.push("PASSWORD_IS_REQUIRED");
    } else if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
        errors.push("PASSWORD_LENGTH_IS_INVALID");
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        data: {
            email: (email as string).trim(),
            password: password as string,
        },
    };
}
