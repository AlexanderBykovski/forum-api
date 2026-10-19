import express from "express"
import { db } from "./prisma/db.js"
import { createPostRepository } from "./repositories/posts.js"
import { createPostService } from "./services/posts.js"
import { createPostHandler } from "./transport/handlers/post.js"
import { createPostRouter } from "./routers/posts.js"

export function createApp() {
    const app = express()

    app.use(express.json())

    const postRepository = createPostRepository(db)
    const postService = createPostService(postRepository)
    const postHandler = createPostHandler(postService)
    const postRouter = createPostRouter(postHandler)

    app.use(postRouter)

    return app
}
