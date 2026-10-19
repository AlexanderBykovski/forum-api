import type { Post } from "./entity.ts";

export interface PostService {
    getPosts: () => Promise<Post[]>;
    getPost: (id: number) => Promise<Post | null>;
    createPost: (data: { title: string; content?: string | null }) => Promise<Post>;
}
