'use server';

import { AqsaAPI } from "@/services/api";
import { USER_TYPE } from "@/constants/user-types";
import { IAidsResponse } from "@/types/actor/common/aids-management/aids-management.types";
import { TYPE_AIDS, TYPE_GROUP_AIDS } from "@/types/actor/common/index.type";
import { fakeAidsResponse } from "@/content/actor/common/aids-management/fake-data/fake-aids";

export interface IGetAidsProps {
    actorId: string;
    role: USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
    page: number;
    limit: number;
    type?: TYPE_AIDS | null;
    dateRange?: [Date | null, Date | null];
    recipientsRange?: [number | null, number | null];
    aidStatus?: TYPE_GROUP_AIDS;
}

const USE_FAKE = false;

export const getAids = async ({
    actorId,
    role,
    page = 1,
    limit = 5,
    type = null,
    dateRange = [null, null],
    recipientsRange = [null, null],
    aidStatus
}: IGetAidsProps): Promise<IAidsResponse> => {
    if (USE_FAKE) {
        const fakeData: IAidsResponse = fakeAidsResponse({ aidStatus, limit, page, actorId, role });

        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeData), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {

        // src\app\api\actor\common\aids - management\route.ts
        const response = await AqsaAPI.get<IAidsResponse>('/actor/common/aids-management', {
            params: {
                actorId,
                role,
                page,
                limit,
                type,
                dateRange,
                recipientsRange,
                aidStatus
            }
        });

        if (response.data?.aids) {
            return response.data;
        }

        throw new Error('بيانات المساعدات غير متوفرة');

    } catch (err: unknown) {

        let errorMessage = 'حدث خطأ أثناء جلب المساعدات';
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            aids: [],
            pagination: {
                page: 1,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            },
            error: errorMessage
        };
    }
};
