import type { PostRepository } from "../domain/posts.ts";
import type { PostService } from "../domain/post/post.types.ts";

export function createPostService(repository: PostRepository): PostService {
    async function getPosts() {
        return await repository.getAllPosts();
    }

    async function getPost(id: number) {
        return await repository.findPostById(id);
    }

    async function createPost(data: { title: string; content?: string | null }) {
        return await repository.createPost({
            title: data.title,
            content: data.content ?? null,
        });
    }

    return { getPosts, getPost, createPost };
}
