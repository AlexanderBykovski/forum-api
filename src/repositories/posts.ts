import type { db as database } from '../prisma/db'
import type { PostFilter } from '../domain/post/entity'

type Database = typeof database

export function createPostRepository(db: Database) {
    async function getAllPosts(filter?: PostFilter) {
        const query = db.orm.public.Post
            .orderBy((post) => post.id.asc())
            .include("category");

        if (filter?.categoryId !== undefined) {
            return await query.where({ categoryId: filter.categoryId }).all();
        }

        return await query.all();
    }

    async function findPostById(id: number) {
        return await db.orm.public.Post
            .where({ id })
            .include("category")
            .first();
    }

    async function createPost(data: { title: string; content: string | null; categoryId: number }) {
        const created = await db.orm.public.Post.create({
            title: data.title,
            content: data.content,
            category: (category) => category.connect({ id: data.categoryId }),
        });

        return await findPostById(created.id);
    }

    return { getAllPosts, findPostById, createPost };
}
