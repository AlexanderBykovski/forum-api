import type { UserRepository } from "../domain/users";
import type { PasswordHasher, TokenSigner, UserService } from "../domain/user/user.types";
import { ConflictError, UnauthorizedError, isUniqueViolation } from "../common/errors";

export function createUserService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenSigner: TokenSigner,
): UserService {
    async function register(input: { email: string; password: string }) {
        const email = input.email.trim().toLowerCase();

        const existing = await repository.findUserByEmail(email);
        if (existing) {
            throw new ConflictError("EMAIL_ALREADY_EXISTS");
        }

        try {
            const hashPassword = await passwordHasher.hash(input.password);
            const user = await repository.createUser({
                email,
                hashPassword,
            });

            return { id: user.id, email: user.email };
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictError("EMAIL_ALREADY_EXISTS");
            }

            throw error;
        }
    }

    async function login(input: { email: string; password: string }) {
        const user = await repository.findUserByEmail(input.email.trim().toLowerCase());
        if (!user || !await passwordHasher.verify(user.hashPassword, input.password)) {
            throw new UnauthorizedError("INVALID_CREDENTIALS");
        }

        return {
            user: { id: user.id, email: user.email },
            accessToken: tokenSigner.signAccessToken(user.id),
        };
    }

    return { register, login };
}
