import type { db as database } from '../prisma/db'
import type { NewUser, UserRepository } from '../domain/users'

type Database = typeof database

export function createUserRepository(db: Database): UserRepository {
    async function createUser(data: NewUser) {
        return await db.orm.public.User.create({
            email: data.email,
            hashPassword: data.hashPassword,
        });
    }

    async function findUserByEmail(email: string) {
        return await db.orm.public.User.where({ email }).first();
    }

    async function findUserById(id: number) {
        return await db.orm.public.User.where({ id }).first();
    }

    return { createUser, findUserByEmail, findUserById };
}
