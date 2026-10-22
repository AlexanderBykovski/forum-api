import type { PostFilter, PostWithCategory } from "./post/entity";

export interface CreatePostInput {
    title: string;
    content: string | null;
    categoryId: number;
    authorId: number;
}

export interface PostRepository {
    getAllPosts: (filter?: PostFilter) => Promise<PostWithCategory[]>;
    findPostById: (id: number) => Promise<PostWithCategory | null>;
    createPost: (data: CreatePostInput) => Promise<PostWithCategory | null>;
}
