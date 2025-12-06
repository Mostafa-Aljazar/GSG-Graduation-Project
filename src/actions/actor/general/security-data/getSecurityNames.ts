'use server';

import { fakeSecuritiesNamesResponse } from "@/content/actor/security/fake-data/fake-securities";
import { AqsaAPI } from "@/services/api";
import { ISecuritiesNamesResponse } from "@/types/actor/general/securities/securities-response.types";


export interface GetSecurityNamesProps {
    ids?: number[];
}

const USE_FAKE = true;

export const getSecurityNames = async ({
    ids,
}: GetSecurityNamesProps): Promise<ISecuritiesNamesResponse> => {
    if (USE_FAKE) {
        const fakeData: ISecuritiesNamesResponse = fakeSecuritiesNamesResponse({ ids });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<ISecuritiesNamesResponse>("/securities/names", {
            params: { ids },
        });

        if (response.data?.securitiesNames) {
            return response.data;
        }

        throw new Error("بيانات أسماء أفراد الأمن غير متوفرة");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء جلب أسماء أفراد الأمن";
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            securitiesNames: [],
            error: errorMessage,
        };
    }
};
