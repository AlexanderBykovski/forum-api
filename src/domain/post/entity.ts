import type { Category } from "../category/entity";
import type { PublicUser } from "../user/entity";

export interface Post {
    id: number;
    title: string;
    content: string | null;
    categoryId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
}

export interface PostWithCategory extends Post {
    category: Category;
    author: PublicUser;
}

export interface PostFilter {
    categoryId?: number;
}
