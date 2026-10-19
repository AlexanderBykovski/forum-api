export interface PostRepository {
    getAllPosts: () => Promise<any[]>;
    findPostById: (id: number) => Promise<any | null>;
    createPost: (data: { title: string; content: string | null }) => Promise<any>;
}
