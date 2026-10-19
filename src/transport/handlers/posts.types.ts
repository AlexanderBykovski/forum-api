import type { Request, Response } from "express"

export interface PostHandler {
    getAllPosts: (req: Request, res: Response) => Promise<void>;
    getPostById: (req: Request, res: Response) => Promise<void>;
    createPost: (req: Request, res: Response) => Promise<void>;
}
