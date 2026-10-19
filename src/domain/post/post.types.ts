import type { PostFilter, PostWithCategory } from "./entity";

export interface PostService {
    getPosts: (filter?: PostFilter) => Promise<PostWithCategory[]>;
    getPost: (id: number) => Promise<PostWithCategory>;
    createPost: (data: { title: string; content?: string | null; categoryId: number }) => Promise<PostWithCategory>;
    resolveCategoryId: (categoryId?: number, categoryName?: string) => Promise<number | undefined>;
}
