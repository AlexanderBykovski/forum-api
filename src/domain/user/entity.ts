export interface User {
    id: number;
    email: string;
    hashPassword: string;
}

export type PublicUser = Pick<User, "id" | "email">;
