'use server';

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IDeleteDelegatesProps {
    delegateIds: number[];
}

const USE_FAKE = true;

export const deleteDelegates = async ({
    delegateIds,
}: IDeleteDelegatesProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم حذف ${delegateIds.length} مندوب بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.delete<IActionResponse>('/delegates/delete', {
            params: { delegateIds },
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم حذف ${delegateIds.length} مندوب بنجاح`,
            };
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء حذف المناديب',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        };
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ أثناء حذف المناديب';
        const statusCode = 500;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
