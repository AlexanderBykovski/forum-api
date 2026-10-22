import type { User } from "./user/entity";

export type NewUser = Omit<User, "id">;

export interface UserRepository {
    createUser: (data: NewUser) => Promise<User>;
    findUserByEmail: (email: string) => Promise<User | null>;
    findUserById: (id: number) => Promise<User | null>;
}
