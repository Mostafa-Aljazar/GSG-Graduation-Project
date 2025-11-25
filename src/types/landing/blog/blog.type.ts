import { IPagination } from "@/types/common/pagination.type"

export interface IArticle {
    id: number
    title: string
    content: string
    brief?: string
    imgs: string[]
    createdAt: Date
    updatedAt?: Date
}

export interface IArticleResponse {
    status: number
    message?: string
    article: IArticle
    error?: string
}

export interface IArticlesResponse {
    status: number
    message?: string
    articles: IArticle[]
    error?: string
    pagination: IPagination
}
