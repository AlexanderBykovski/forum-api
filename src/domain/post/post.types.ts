import type { PostFilter, PostWithCategory } from "./entity";

export interface CreatePostInput {
    title: string;
    content?: string | null;
    categoryId: number;
    authorId: number;
}

export interface PostService {
    getPosts: (filter?: PostFilter) => Promise<PostWithCategory[]>;
    getPost: (id: number) => Promise<PostWithCategory>;
    createPost: (data: CreatePostInput) => Promise<PostWithCategory>;
    resolveCategoryId: (categoryId?: number, categoryName?: string) => Promise<number | undefined>;
}
