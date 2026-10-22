import express from "express"
import { db } from "./prisma/db"
import { createCategoryRepository } from "./repositories/categories"
import { createPostRepository } from "./repositories/posts"
import { createUserRepository } from "./repositories/users"
import { createCategoryService } from "./services/categories"
import { createPostService } from "./services/posts"
import { createUserService } from "./services/users"
import { createCategoryHandler } from "./transport/handlers/category"
import { createPostHandler } from "./transport/handlers/post"
import { createAuthHandler } from "./transport/handlers/auth"
import { createCategoryRouter } from "./routers/categories"
import { createPostRouter } from "./routers/posts"
import { createAuthRouter } from "./routers/auth"
import { createErrorHandler } from "./common/error-handler"
import { hashPassword, verifyPassword } from "./lib/password"
import { signAccessToken } from "./lib/jwt"

export function createApp() {
    const app = express()

    app.use(express.json())

    const categoryRepository = createCategoryRepository(db)
    const postRepository = createPostRepository(db)
    const userRepository = createUserRepository(db)

    const categoryService = createCategoryService(categoryRepository)
    const userService = createUserService(
        userRepository,
        { hash: hashPassword, verify: verifyPassword },
        { signAccessToken },
    )
    const postService = createPostService(postRepository, categoryRepository, userRepository)

    const categoryHandler = createCategoryHandler(categoryService)
    const postHandler = createPostHandler(postService)
    const authHandler = createAuthHandler(userService)

    const categoryRouter = createCategoryRouter(categoryHandler)
    const postRouter = createPostRouter(postHandler)
    const authRouter = createAuthRouter(authHandler)

    app.use(categoryRouter)
    app.use(postRouter)
    app.use(authRouter)

    app.use((req, res) => {
        res.status(404).json({
            message: "ROUTE_NOT_FOUND"
        })
    })

    app.use(createErrorHandler())

    return app
}
