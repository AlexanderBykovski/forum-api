import type { PostRepository } from "../domain/posts";
import type { CategoryRepository } from "../domain/categories";
import type { UserRepository } from "../domain/users";
import type { CreatePostInput, PostService } from "../domain/post/post.types";
import type { PostFilter } from "../domain/post/entity";
import { NotFoundError } from "../common/errors";

export function createPostService(
    postRepository: PostRepository,
    categoryRepository: CategoryRepository,
    userRepository: UserRepository,
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

    async function createPost(data: CreatePostInput) {
        const category = await categoryRepository.findCategoryById(data.categoryId);
        if (!category) {
            throw new NotFoundError("CATEGORY_NOT_FOUND");
        }

        const author = await userRepository.findUserById(data.authorId);
        if (!author) {
            throw new NotFoundError("AUTHOR_NOT_FOUND");
        }

        const post = await postRepository.createPost({
            title: data.title,
            content: data.content ?? null,
            categoryId: data.categoryId,
            authorId: data.authorId,
        });
        if (!post) {
            throw new NotFoundError("POST_NOT_FOUND");
        }

        return post;
    }

    return { getPosts, getPost, createPost, resolveCategoryId };
}
