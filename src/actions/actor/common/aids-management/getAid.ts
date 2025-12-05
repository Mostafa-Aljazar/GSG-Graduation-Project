
'use server';

import { USER_TYPE } from "@/constants/user-types";
import { fakeAidResponse } from "@/content/actor/common/aids-management/fake-data/fake-aids";
import { AqsaAPI } from "@/services/api";
import { IAidResponse, TAid } from "@/types/actor/common/aids-management/aids-management.types";

export interface IGetAidProps {
    aidId: number;
    actorId: number;
    role: USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
}

const USE_FAKE = true;

export const getAid = async ({ aidId, actorId, role }: IGetAidProps): Promise<IAidResponse> => {

    if (USE_FAKE) {
        const fakeData: IAidResponse = fakeAidResponse({ aidId, actorId, role });

        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IAidResponse>(`/aids/${aidId}`, {
            params: {
                actorId, role
            },
        });

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

