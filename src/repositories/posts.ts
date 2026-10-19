import type { db as database } from '../prisma/db.ts'

type Database = typeof database

export function createPostRepository(db: Database) {
    async function getAllPosts() {
        return await db.orm.public.Post.orderBy((post) => post.id.asc()).all();
    }

    async function findPostById(id: number) {
        return await db.orm.public.Post.where({ id }).first();
    }

    async function createPost(data: { title: string; content: string | null }) {
        return await db.orm.public.Post.create({
            title: data.title,
            content: data.content,
        });
    }

    return { getAllPosts, findPostById, createPost };
}
