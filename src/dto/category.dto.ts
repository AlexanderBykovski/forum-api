export interface CreateCategoryDto {
    name: string;
}

export type ValidationResult<T> =
    | { ok: true; data: T }
    | { ok: false; errors: string[] };

const ALLOWED_FIELDS = ["name"];
const MAX_NAME_LENGTH = 100;

export function validateCreateCategory(body: unknown): ValidationResult<CreateCategoryDto> {
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

    const name = record["name"];
    if (typeof name !== "string" || name.trim().length === 0) {
        errors.push("NAME_IS_REQUIRED");
    } else if (name.trim().length > MAX_NAME_LENGTH) {
        errors.push("NAME_IS_TOO_LONG");
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, data: { name: (name as string).trim() } };
}
