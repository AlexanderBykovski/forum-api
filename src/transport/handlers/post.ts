import type { Request, Response } from "express";
import type { PostService } from "../../domain/post/post.types";
import type { PostHandler } from "./posts.types";
import type { PostFilter } from "../../domain/post/entity";
import { validateCreatePost, isInvalidId } from "../../dto/post.dto";
import { BadRequestError, UnprocessableEntityError } from "../../common/errors";

export function createPostHandler(service: PostService): PostHandler {

    function parseId(raw: string | string[] | undefined): number {
        const value = Array.isArray(raw) ? raw[0] : raw;
        const id = Number(value);
        if (!value || !Number.isInteger(id) || id <= 0) {
            throw new BadRequestError("INVALID_POST_ID");
        }

        return id;
    }

    async function getAllPosts(req: Request, res: Response) {
        const rawCategoryId = req.query["categoryId"];
        const rawCategoryName = req.query["category"];

        let categoryId: number | undefined;
        if (rawCategoryId !== undefined) {
            const value = Array.isArray(rawCategoryId) ? rawCategoryId[0] : rawCategoryId;
            const parsed = Number(value);
            if (!value || !Number.isInteger(parsed) || parsed <= 0) {
                throw new BadRequestError("INVALID_CATEGORY_ID");
            }

            categoryId = parsed;
        }

        let categoryName: string | undefined;
        if (rawCategoryName !== undefined) {
            const value = Array.isArray(rawCategoryName) ? rawCategoryName[0] : rawCategoryName;
            if (typeof value !== "string" || value.trim().length === 0) {
                throw new BadRequestError("INVALID_CATEGORY_NAME");
            }

            categoryName = value.trim();
        }

        const filter: PostFilter = {};
        if (categoryId !== undefined || categoryName !== undefined) {
            const resolvedId = await service.resolveCategoryId(categoryId, categoryName);
            filter.categoryId = resolvedId;
        }

        const posts = await service.getPosts(filter);
        res.status(200).json(posts);
    }

    async function getPostById(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const post = await service.getPost(id);

        res.status(200).json(post);
    }

    async function createPost(req: Request, res: Response) {
        const body = req.body;
        if (typeof body === "object" && body !== null && !Array.isArray(body)) {
            const record = body as Record<string, unknown>;
            const rawCategoryId = record["categoryId"];
            if (rawCategoryId !== undefined && isInvalidId(rawCategoryId)) {
                throw new BadRequestError("INVALID_CATEGORY_ID");
            }

            const rawAuthorId = record["authorId"];
            if (rawAuthorId !== undefined && isInvalidId(rawAuthorId)) {
                throw new BadRequestError("INVALID_AUTHOR_ID");
            }
        }

        const result = validateCreatePost(body);
        if (!result.ok) {
            throw new UnprocessableEntityError(result.errors);
        }

        const post = await service.createPost(result.data);
        res.status(201).json(post);
    }

    return { getAllPosts, getPostById, createPost };
}
