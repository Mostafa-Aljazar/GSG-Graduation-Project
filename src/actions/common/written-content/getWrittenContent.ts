'use server';

import { fakeWrittenContentResponse } from '@/content/landing/written-content/fake-data';
import { AqsaGuestAPI } from '@/services/api';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { IWrittenContent, IWrittenContentResponse, } from '@/types/common/written-content/written-content-response.type';

export interface IGetWrittenContentProps {
  id: number;
  type: TYPE_WRITTEN_CONTENT;
}

const USE_FAKE = true;

export const getWrittenContent = async ({
  id,
  type,
}: IGetWrittenContentProps): Promise<IWrittenContentResponse> => {
  if (USE_FAKE) {
    const fakeResponse = fakeWrittenContentResponse({ id, type });
    return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  /////////////////////////////////////////////////////////////
  // FIXME: THIS IS THE REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////

  try {
    const response = await AqsaGuestAPI.get<IWrittenContentResponse>(`/written-content/${id}`, {
      params: {
        type,
      },
    });

    if ((response.data.error && response.data.error.length > 0) || response.status !== 200) {
      throw new Error(response.data.error || 'حدث خطأ أثناء جلب بيانات المحتوى');
    }

    return response.data;
  } catch (err: unknown) {
    const statusCode = 500;
    let errorMessage = 'حدث خطأ أثناء جلب بيانات المحتوى';

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      status: statusCode,
      message: errorMessage,
      writtenContent: {} as IWrittenContent,
      error: errorMessage,
    };
  }
};
