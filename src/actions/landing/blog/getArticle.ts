"use server";

import { fakeArticleResponse } from "@/content/landing/blog/fake-data";
import { AqsaGuestAPI } from "@/services/api";
import { IArticle, IArticleResponse } from "@/types/landing/blog/blog.type";

export interface IGetArticleProps {
    id: number;
}

const USE_FAKE = true;

export const getArticle = async ({ id, }: IGetArticleProps): Promise<IArticleResponse> => {
    if (USE_FAKE) {
        const fake = fakeArticleResponse({ id });
        return new Promise(resolve => setTimeout(() => resolve(fake), 500));
    }

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////

    try {
        const response = await AqsaGuestAPI.get<IArticleResponse>(`/blog/${id}`);

        if ((response.data.error && response.data.error.length > 0) || response.status !== 200) {
            throw new Error(response.data.error || "حدث خطأ أثناء جلب بيانات المحتوى")
        }

        return response.data;

    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "حدث خطأ أثناء جلب بيانات المحتوى"

        if (err instanceof Error) {
            errorMessage = err.message
        }

        return {
            status: statusCode,
            message: errorMessage,
            article: {} as IArticle,
            error: errorMessage,
        };
    }
};
