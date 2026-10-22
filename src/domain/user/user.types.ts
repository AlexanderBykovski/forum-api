import type { PublicUser } from "./entity";

export interface AuthInput {
    email: string;
    password: string;
}

export interface PasswordHasher {
    hash: (password: string) => Promise<string>;
    verify: (hash: string, password: string) => Promise<boolean>;
}

export interface TokenSigner {
    signAccessToken: (userId: number) => string;
}

export interface UserService {
    register: (input: AuthInput) => Promise<PublicUser>;
    login: (input: AuthInput) => Promise<{ user: PublicUser; accessToken: string }>;
}
