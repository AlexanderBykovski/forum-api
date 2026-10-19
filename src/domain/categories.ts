export interface CategoryRepository {
    getAllCategories: () => Promise<any[]>;
    findCategoryById: (id: number) => Promise<any | null>;
    findCategoryByName: (name: string) => Promise<any | null>;
    createCategory: (data: { name: string }) => Promise<any>;
}
