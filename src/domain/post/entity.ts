import type { Category } from "../category/entity";

export interface Post {
    id: number;
    title: string;
    content: string | null;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}

export interface PostWithCategory extends Post {
    category: Category;
}

export interface PostFilter {
    categoryId?: number;
}
