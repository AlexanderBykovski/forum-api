import type { PostFilter } from "./post/entity";

export interface PostRepository {
    getAllPosts: (filter?: PostFilter) => Promise<any[]>;
    findPostById: (id: number) => Promise<any | null>;
    createPost: (data: { title: string; content: string | null; categoryId: number }) => Promise<any>;
}
