import { Router } from "express"
import type { CategoryHandler } from "../transport/handlers/categories.types"

export function createCategoryRouter(handler: CategoryHandler) {
    const router = Router();

    router.get("/categories", handler.getAllCategories)
    router.get("/categories/:id", handler.getCategoryById)
    router.post("/categories", handler.createCategory)

    return router;
}
