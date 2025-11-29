"use server";

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IChangeDelegateProps {
    displacedIds: number[];
    delegateId: number;
}

const USE_FAKE = true;

export const changeDelegate = async ({
    displacedIds,
    delegateId,
}: IChangeDelegateProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeData: IActionResponse = {
            status: 200,
            message: `تم تغيير المندوب لـ ${displacedIds.length} نازح بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>("/displaceds/change-delegate", {
            displacedIds,
            delegateId,
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم تغيير المندوب لـ ${displacedIds.length} نازح بنجاح`,
            };
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء تغيير المندوب',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        };

    } catch (error: any) {
        let errorMessage = 'حدث خطأ أثناء تغيير المندوب';
        const statusCode = 500;

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
