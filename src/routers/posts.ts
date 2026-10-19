import { Router } from "express"
import type { PostHandler } from "../transport/handlers/posts.types.ts"

export function createPostRouter(handler: PostHandler) {
    const router = Router();

    router.get("/posts", handler.getAllPosts)
    router.get("/posts/:id", handler.getPostById)
    router.post("/posts", handler.createPost)

    return router;
}
