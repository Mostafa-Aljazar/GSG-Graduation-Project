'use server';

import { fakeSecuritiesResponse } from "@/content/actor/security/fake-data/fake-securities";
import { AqsaAPI } from "@/services/api";
import { ISecuritiesResponse } from "@/types/actor/general/securities/securities-response.types";

export interface IGetSecurityDataProps {
    page?: number;
    limit?: number;
}

const USE_FAKE = false;

export const getSecurities = async ({
    page = 1,
    limit = 15,
}: IGetSecurityDataProps): Promise<ISecuritiesResponse> => {
    if (USE_FAKE) {
        const fakeData: ISecuritiesResponse = fakeSecuritiesResponse({ page, limit });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<ISecuritiesResponse>("/actor/securities", {
            params: { page, limit },
        });

        if (response.data?.securities) {
            return response.data;
        }

        throw new Error("بيانات أفراد الأمن غير متوفرة");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء جلب بيانات أفراد الأمن";
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            securities: [],
            pagination: {
                page: 1,
                limit: 0,
                totalItems: 0,
                totalPages: 0,
            },
            error: errorMessage,
        };
    }
};
