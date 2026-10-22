import type { Request, Response } from "express";
import type { UserService } from "../../domain/user/user.types";
import type { AuthHandler } from "./auth.types";
import { validateAuthCredentials } from "../../dto/auth.dto";
import { UnprocessableEntityError } from "../../common/errors";

const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;

export function createAuthHandler(service: UserService): AuthHandler {

    function parseCredentials(body: unknown) {
        const result = validateAuthCredentials(body);
        if (!result.ok) {
            throw new UnprocessableEntityError(result.errors);
        }

        return result.data;
    }

    async function register(req: Request, res: Response) {
        const credentials = parseCredentials(req.body);
        const user = await service.register(credentials);

        res.status(201).json(user);
    }

    async function login(req: Request, res: Response) {
        const credentials = parseCredentials(req.body);
        const result = await service.login(credentials);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: ACCESS_TOKEN_MAX_AGE_MS,
            path: "/",
        });
        res.status(200).json(result.user);
    }

    return { register, login };
}
