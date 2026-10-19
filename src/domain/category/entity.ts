import type { Post } from "../post/entity";

export interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryWithPosts extends Category {
    posts: Post[];
}
