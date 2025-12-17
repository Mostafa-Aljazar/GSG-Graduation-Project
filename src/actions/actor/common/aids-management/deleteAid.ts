"use server";

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IDeleteAidProps {
    aidId: string;
    managerId: string;
}

const USE_FAKE = false;

export const deleteAid = async ({
    aidId,
    // managerId
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
        // src/app/api/actor/common/aids-management/[aidId]/route.ts
        const response = await AqsaAPI.delete<IActionResponse>(`/actor/common/aids-management/${aidId}`);

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