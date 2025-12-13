'use server';

import { fakeWrittenContentResponse } from '@/content/landing/written-content/fake-data';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IWrittenContentResponse } from '@/types/common/written-content/written-content-response.type';

export interface IGetWrittenContent {
  id: string;
  type: TYPE_WRITTEN_CONTENT;
}

export const getWrittenContent = async ({
  id,
  type,
}: IGetWrittenContent): Promise<IWrittenContentResponse> => {
  const fakeResponse = fakeWrittenContentResponse({ id, type });

  return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
};

/*
 const fakeResponse = fakeDisplacedReceivedAidsResponse({ displaced_Id, page, limit, tab_type })

    return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 1000));

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {

        const response = await AqsaAPI.get<DisplacedReceivedAidsResponse>(`/displaceds/${displaced_Id}/received-aids`, {
            params: {
                page,
                limit,
                tab_type,
            }
        });

        if (response.data?.received_aids) {
            return response.data
        }

        throw new Error('بيانات المساعدات غير متوفرة');

    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error || error.message || 'حدث خطأ أثناء جلب المساعدات';

        return {
            status: error.response?.status || 500,
            message: errorMessage,
            received_aids: [],
            pagination: { page: 1, limit: 0, total_items: 0, total_pages: 0 },
            error: errorMessage,
        };
    } */
