import type { Request, Response } from "express"
import type { AuthCredentialsDto } from "../../dto/auth.dto"
import type { PublicUser } from "../../domain/user/entity"

export interface AuthHandler {
    register: (
        req: Request<{}, {}, AuthCredentialsDto>,
        res: Response
    ) => Promise<void>;
    login: (
        req: Request<{}, {}, AuthCredentialsDto>,
        res: Response
    ) => Promise<void>;
}

export type AuthUserResponse = PublicUser;
