import type { db as database } from '../prisma/db'

type Database = typeof database

export function createCategoryRepository(db: Database) {
    async function getAllCategories() {
        return await db.orm.public.Category.orderBy((category) => category.id.asc()).all();
    }

    async function findCategoryById(id: number) {
        return await db.orm.public.Category.where({ id }).first();
    }

    async function findCategoryByName(name: string) {
        return await db.orm.public.Category.where({ name }).first();
    }

    async function createCategory(data: { name: string }) {
        return await db.orm.public.Category.create({
            name: data.name,
        });
    }

    return { getAllCategories, findCategoryById, findCategoryByName, createCategory };
}
