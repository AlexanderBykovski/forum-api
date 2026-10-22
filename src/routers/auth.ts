import { Router } from "express"
import type { AuthHandler } from "../transport/handlers/auth.types"

export function createAuthRouter(handler: AuthHandler) {
    const router = Router();

    router.post("/auth/register", handler.register)
    router.post("/auth/login", handler.login)

    return router;
}
