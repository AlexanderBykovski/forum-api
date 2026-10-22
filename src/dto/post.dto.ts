export interface CreatePostDto {
    title: string;
    content: string | null;
    categoryId: number;
    authorId: number;
}

export type ValidationResult<T> =
    | { ok: true; data: T }
    | { ok: false; errors: string[] };

const ALLOWED_FIELDS = ["title", "content", "categoryId", "authorId"];
const MAX_TITLE_LENGTH = 200;

export function isInvalidId(value: unknown): boolean {
    return typeof value !== "number" || !Number.isInteger(value) || value <= 0;
}

export function validateCreatePost(body: unknown): ValidationResult<CreatePostDto> {
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

    const title = record["title"];
    if (typeof title !== "string" || title.trim().length === 0) {
        errors.push("TITLE_IS_REQUIRED");
    } else if (title.trim().length > MAX_TITLE_LENGTH) {
        errors.push("TITLE_IS_TOO_LONG");
    }

    const content = record["content"];
    if (content !== undefined && content !== null && typeof content !== "string") {
        errors.push("CONTENT_MUST_BE_A_STRING");
    }

    if (record["categoryId"] === undefined || record["categoryId"] === null) {
        errors.push("CATEGORY_ID_IS_REQUIRED");
    }

    if (record["authorId"] === undefined || record["authorId"] === null) {
        errors.push("AUTHOR_ID_IS_REQUIRED");
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        data: {
            title: (title as string).trim(),
            content: (content as string | null | undefined) ?? null,
            categoryId: record["categoryId"] as number,
            authorId: record["authorId"] as number,
        },
    };
}
