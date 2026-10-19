import type { Category } from "./entity.ts";

export interface CategoryService {
    getCategories: () => Promise<Category[]>;
    getCategory: (id: number) => Promise<Category>;
    getCategoryByName: (name: string) => Promise<Category>;
    createCategory: (data: { name: string }) => Promise<Category>;
}
