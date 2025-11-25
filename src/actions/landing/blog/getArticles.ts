"use server"

import { fakeArticlesResponse } from "@/content/landing/blog/fake-data"
import { AqsaGuestAPI } from "@/services/api"
import { IArticlesResponse } from "@/types/landing/blog/blog.type"

export interface IGetArticlesProps {
    page?: number
    limit?: number
}

const USE_FAKE = true

export const getArticles = async ({ page = 1, limit = 5 }: IGetArticlesProps): Promise<IArticlesResponse> => {
    if (USE_FAKE) {
        const fake = fakeArticlesResponse({ page, limit })
        return new Promise(resolve => setTimeout(() => resolve(fake), 500))
    }

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////

    try {
        const response = await AqsaGuestAPI.get<IArticlesResponse>("/blog", {
            params: { page, limit }
        })

        if ((response.data.error && response.data.error.length > 0) || response.status !== 200) {
            throw new Error(response.data.error || "حدث خطأ أثناء جلب بيانات المحتوى")
        }

        return response.data;

    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء جلب بيانات المحتوى"

        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {
            status: 500,
            message: errorMessage,
            articles: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: errorMessage
        }
    }
}
