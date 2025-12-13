'use server';

import { fakeDisplacedReceivedAidsResponse } from "@/content/actor/displaceds/fake-data/fake-displaced-received-aids";
import { AqsaAPI } from "@/services/api";
import { DISPLACED_RECEIVED_AIDS_TABS } from "@/types/actor/common/index.type";
import { IDisplacedReceivedAidsResponse } from "@/types/actor/displaceds/received-aids/displaced-received-aids-response.type";


export interface IGetDisplacedReceivedAidsProps {
    displacedId: string;
    page?: number;
    limit?: number;
    tabType?: DISPLACED_RECEIVED_AIDS_TABS;
}

const USE_FAKE = true;

export const getDisplacedReceivedAids = async ({
    displacedId,
    page = 1,
    limit = 10,
    tabType,
}: IGetDisplacedReceivedAidsProps): Promise<IDisplacedReceivedAidsResponse> => {
    if (USE_FAKE) {
        const fakeData = fakeDisplacedReceivedAidsResponse({ displacedId, page, limit, tabType });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 1000));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<IDisplacedReceivedAidsResponse>(
            `/displaceds/${displacedId}/received-aids`,
            {
                params: { page, limit, tabType },
            }
        );

        if (response.data?.receivedAids) return response.data;

        throw new Error('بيانات المساعدات غير متوفرة');
    } catch (err: unknown) {

        let errorMessage = 'حدث خطأ أثناء جلب المساعدات';
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            receivedAids: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: errorMessage,
        };
    }
};
