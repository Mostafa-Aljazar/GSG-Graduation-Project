'use server';

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IDeleteSecurityTaskProps {
    taskId: number;
    securityId: number;
}

const USE_FAKE = true;

export const deleteSecurityTask = async ({
    taskId,
    securityId,
}: IDeleteSecurityTaskProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم حذف المهمة بنجاح",
        };
        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.delete<IActionResponse>("/securities/tasks", {
            params: { taskId, securityId },
        });

        if (response.data?.status === 200) {
            return {
                status: 200,
                message: "تم حذف المهمة بنجاح",
            };
        }

        throw new Error("حدث خطأ أثناء حذف المهمة");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء حذف المهمة";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
