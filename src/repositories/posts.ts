import type { PostFilter, PostWithCategory } from '../domain/post/entity'
import type { CreatePostInput, PostRepository } from '../domain/posts'
import type { PublicUser } from '../domain/user/entity'

type Database = typeof import('../prisma/db').db

function toPublicUser(author: { id: number; email: string } | null): PublicUser {
    if (!author) {
        throw new Error("POST_AUTHOR_MISSING");
    }

    return { id: author.id, email: author.email };
}

export function createPostRepository(db: Database): PostRepository {
    async function getAllPosts(filter?: PostFilter): Promise<PostWithCategory[]> {
        const query = db.orm.public.Post
            .orderBy((post) => post.id.asc())
            .include("category")
            .include("author", (author) => author.select("id", "email"));

        let posts;
        if (filter?.categoryId !== undefined) {
            posts = await query.where({ categoryId: filter.categoryId }).all();
        } else {
            posts = await query.all();
        }

        return posts.map((post) => ({ ...post, author: toPublicUser(post.author) }));
    }

    async function findPostById(id: number): Promise<PostWithCategory | null> {
        const post = await db.orm.public.Post
            .where({ id })
            .include("category")
            .include("author", (author) => author.select("id", "email"))
            .first();

        if (!post) {
            return null;
        }

        return { ...post, author: toPublicUser(post.author) };
    }

    async function createPost(data: CreatePostInput): Promise<PostWithCategory | null> {
        const created = await db.orm.public.Post.create({
            title: data.title,
            content: data.content,
            category: (category) => category.connect({ id: data.categoryId }),
            author: (author) => author.connect({ id: data.authorId }),
        });

        return await findPostById(created.id);
    }

    return { getAllPosts, findPostById, createPost };
}
