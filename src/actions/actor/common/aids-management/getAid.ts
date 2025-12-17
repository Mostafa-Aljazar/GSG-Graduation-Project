'use server';

import { fakeAidResponse } from "@/content/actor/common/aids-management/fake-data/fake-aids";
import { AqsaAPI } from "@/services/api";
import { IAidResponse, TAid } from "@/types/actor/common/aids-management/aids-management.types";

export interface IGetAidProps {
    aidId: string;

}

const USE_FAKE = false;

export const getAid = async ({ aidId, }: IGetAidProps): Promise<IAidResponse> => {

    if (USE_FAKE) {
        const fakeData: IAidResponse = fakeAidResponse({ aidId, });

        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        // src\app\api\actor\common\aids-management\[aidId]\route.ts
        const response = await AqsaAPI.get<IAidResponse>(`/actor/common/aids-management/${aidId}/`);

        if (response.data?.aid) {
            return response.data;
        }

        throw new Error('بيانات المساعدة غير متوفرة');

    } catch (err: unknown) {

        let errorMessage = 'حدث خطأ أثناء جلب المساعدة';
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            aid: {} as TAid,
            error: errorMessage
        };
    }
};

