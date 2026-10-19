import express from "express"
import { db } from "./prisma/db"
import { createCategoryRepository } from "./repositories/categories"
import { createPostRepository } from "./repositories/posts"
import { createCategoryService } from "./services/categories"
import { createPostService } from "./services/posts"
import { createCategoryHandler } from "./transport/handlers/category"
import { createPostHandler } from "./transport/handlers/post"
import { createCategoryRouter } from "./routers/categories"
import { createPostRouter } from "./routers/posts"
import { createErrorHandler } from "./common/error-handler"

export function createApp() {
    const app = express()

    app.use(express.json())

    const categoryRepository = createCategoryRepository(db)
    const postRepository = createPostRepository(db)

    const categoryService = createCategoryService(categoryRepository)
    const postService = createPostService(postRepository, categoryRepository)

    const categoryHandler = createCategoryHandler(categoryService)
    const postHandler = createPostHandler(postService)

    const categoryRouter = createCategoryRouter(categoryHandler)
    const postRouter = createPostRouter(postHandler)

    app.use(categoryRouter)
    app.use(postRouter)

    app.use((req, res) => {
        res.status(404).json({
            message: "ROUTE_NOT_FOUND"
        })
    })

    app.use(createErrorHandler())

    return app
}
