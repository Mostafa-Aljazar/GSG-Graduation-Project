'use server';

import { fakeWrittenContentsResponse } from '@/content/landing/written-content/fake-data';
import { AqsaGuestAPI } from '@/services/api';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IWrittenContentsResponse } from '@/types/common/written-content/written-content-response.type';

export interface IGetWrittenContentsProps {
  page?: number;
  limit?: number;
  type: TYPE_WRITTEN_CONTENT;
}

const USE_FAKE = false;

export const getWrittenContents = async ({
  page = 1,
  limit = 5,
  type,
}: IGetWrittenContentsProps): Promise<IWrittenContentsResponse> => {
  if (USE_FAKE) {
    const fakeResponse: IWrittenContentsResponse = fakeWrittenContentsResponse({
      page,
      limit,
      type,
    });
    return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////

  try {
    const response = await AqsaGuestAPI.get<IWrittenContentsResponse>('/actor/common/written-contents', {
      params: { page, limit, type },
    });

    if ((response.data.error && response.data.error.length > 0) || response.status !== 200) {
      throw new Error(response.data.error || 'حدث خطأ أثناء جلب بيانات المحتوى');
    }

    return response.data;
  } catch (err: unknown) {
    let errorMessage = 'حدث خطأ أثناء جلب بيانات المحتوى';

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      status: 500,
      message: errorMessage,
      writtenContents: [],
      pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
      error: errorMessage,
    };
  }
};
