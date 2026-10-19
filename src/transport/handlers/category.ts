import type { Request, Response } from "express";
import type { CategoryService } from "../../domain/category/category.types";
import type { CategoryHandler } from "./categories.types";
import { validateCreateCategory } from "../../dto/category.dto";
import { BadRequestError, UnprocessableEntityError } from "../../common/errors";

export function createCategoryHandler(service: CategoryService): CategoryHandler {

    function parseId(raw: string | string[] | undefined): number {
        const value = Array.isArray(raw) ? raw[0] : raw;
        const id = Number(value);
        if (!value || !Number.isInteger(id) || id <= 0) {
            throw new BadRequestError("INVALID_CATEGORY_ID");
        }

        return id;
    }

    async function getAllCategories(req: Request, res: Response) {
        const categories = await service.getCategories();
        res.status(200).json(categories);
    }

    async function getCategoryById(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const category = await service.getCategory(id);

        res.status(200).json(category);
    }

    async function createCategory(req: Request, res: Response) {
        const result = validateCreateCategory(req.body);
        if (!result.ok) {
            throw new UnprocessableEntityError(result.errors);
        }

        const category = await service.createCategory(result.data);
        res.status(201).json(category);
    }

    return { getAllCategories, getCategoryById, createCategory };
}
