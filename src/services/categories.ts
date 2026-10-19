import type { CategoryRepository } from "../domain/categories";
import type { CategoryService } from "../domain/category/category.types";
import { ConflictError, NotFoundError, isUniqueViolation } from "../common/errors";

export function createCategoryService(repository: CategoryRepository): CategoryService {
    async function getCategories() {
        return await repository.getAllCategories();
    }

    async function getCategory(id: number) {
        const category = await repository.findCategoryById(id);
        if (!category) {
            throw new NotFoundError("CATEGORY_NOT_FOUND");
        }

        return category;
    }

    async function getCategoryByName(name: string) {
        const category = await repository.findCategoryByName(name);
        if (!category) {
            throw new NotFoundError("CATEGORY_NOT_FOUND");
        }

        return category;
    }

    async function createCategory(data: { name: string }) {
        const existing = await repository.findCategoryByName(data.name);
        if (existing) {
            throw new ConflictError("CATEGORY_ALREADY_EXISTS");
        }

        try {
            return await repository.createCategory(data);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictError("CATEGORY_ALREADY_EXISTS");
            }

            throw error;
        }
    }

    return { getCategories, getCategory, getCategoryByName, createCategory };
}
