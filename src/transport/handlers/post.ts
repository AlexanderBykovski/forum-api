import type { Request, Response } from "express";
import type { PostService } from "../../domain/post/post.types.js";
import type { PostHandler } from "./posts.types.js";

export function createPostHandler(service: PostService): PostHandler {

    async function getAllPosts(req: Request, res: Response) {
        const posts = await service.getPosts();
        res.status(200).json(posts);
    }

    async function getPostById(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "INVALID_POST_ID"
            });
            return;
        }

        const post = await service.getPost(id);
        if (!post) {
            res.status(404).json({
                message: "POST_NOT_FOUND"
            });
            return;
        }

        res.status(200).json(post);
    }

    async function createPost(req: Request, res: Response) {
        const { title, content } = req.body ?? {};

        if (typeof title !== "string" || title.trim().length === 0) {
            res.status(422).json({
                message: "TITLE_IS_REQUIRED"
            });
            return;
        }

        if (content !== undefined && content !== null && typeof content !== "string") {
            res.status(422).json({
                message: "CONTENT_MUST_BE_A_STRING"
            });
            return;
        }

        const post = await service.createPost({ title, content: content ?? null });
        res.status(201).json(post);
    }

    return { getAllPosts, getPostById, createPost };
}
