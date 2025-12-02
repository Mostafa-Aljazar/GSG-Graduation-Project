"use server";

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IDeleteAidProps {
    aidId: number;
    managerId: number;
}

const USE_FAKE = true;

export const deleteAid = async ({
    aidId,
    managerId
}: IDeleteAidProps): Promise<IActionResponse> => {
    // Fake Mode
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم حذف المساعدة بنجاح`,
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }


    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.delete<IActionResponse>(`/aids`, {
            params: {
                aidId, managerId
            }
        });

        if (response.status === 200) {
            return {
                status: 200,
                message: `تم حذف المساعدة بنجاح`,
            };
        }

        return {
            status: response.status,
            message: `حدث خطأ أثناء حذف  المساعدة`,
            error: response.data?.error || "خطأ غير متوقع",
        };
    } catch (err: unknown) {
        let errorMessage = `حدث خطأ أثناء حذف  المساعدة`;

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};