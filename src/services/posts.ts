import type { PostRepository } from "../domain/posts";
import type { CategoryRepository } from "../domain/categories";
import type { PostService } from "../domain/post/post.types";
import type { PostFilter } from "../domain/post/entity";
import { NotFoundError } from "../common/errors";

export function createPostService(
    postRepository: PostRepository,
    categoryRepository: CategoryRepository,
): PostService {
    async function resolveCategoryId(categoryId?: number, categoryName?: string) {
        if (categoryId !== undefined) {
            const category = await categoryRepository.findCategoryById(categoryId);
            if (!category) {
                throw new NotFoundError("CATEGORY_NOT_FOUND");
            }

            return category.id;
        }

        if (categoryName !== undefined) {
            const category = await categoryRepository.findCategoryByName(categoryName);
            if (!category) {
                throw new NotFoundError("CATEGORY_NOT_FOUND");
            }

            return category.id;
        }

        return undefined;
    }

    async function getPosts(filter?: PostFilter) {
        return await postRepository.getAllPosts(filter);
    }

    async function getPost(id: number) {
        const post = await postRepository.findPostById(id);
        if (!post) {
            throw new NotFoundError("POST_NOT_FOUND");
        }

        return post;
    }

    async function createPost(data: { title: string; content?: string | null; categoryId: number }) {
        const category = await categoryRepository.findCategoryById(data.categoryId);
        if (!category) {
            throw new NotFoundError("CATEGORY_NOT_FOUND");
        }

        return await postRepository.createPost({
            title: data.title,
            content: data.content ?? null,
            categoryId: data.categoryId,
        });
    }

    return { getPosts, getPost, createPost, resolveCategoryId };
}
