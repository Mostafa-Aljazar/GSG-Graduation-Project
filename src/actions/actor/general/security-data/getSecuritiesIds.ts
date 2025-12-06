'use server';

import { fakeSecuritiesIdsResponse } from "@/content/actor/security/fake-data/fake-securities";
import { AqsaAPI } from "@/services/api";
import { ISecurityIdsResponse } from "@/types/actor/general/securities/securities-response.types";


const USE_FAKE = true;

export const getSecuritiesIds = async (): Promise<ISecurityIdsResponse> => {
    if (USE_FAKE) {
        const fakeData: ISecurityIdsResponse = fakeSecuritiesIdsResponse();
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<ISecurityIdsResponse>("/securities/ids");

        if (response.data?.securitiesIds) {
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
            securitiesIds: [],
            error: errorMessage,
        };
    }
};
