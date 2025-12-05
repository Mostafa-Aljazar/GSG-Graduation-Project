'use server';

import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { TAid } from "@/types/actor/common/aids-management/aids-management.types";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IUpdateAidProps {
    payload: TAid;
}

const USE_FAKE = true;

export const updateAid = async ({ payload }: IUpdateAidProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم تعديل المساعدة بنجاح",
        };
        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.put<IActionResponse>(`/aids/${payload.id}/update`, payload);

        if (response.data) {
            return {
                status: 200,
                message: "تم تعديل المساعدة بنجاح",
            };
        }

        return {
            status: 500,
            message: "حدث خطأ أثناء تعديل المساعدة",
            error: "حدث خطأ أثناء تعديل المساعدة",
        };

    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تعديل المساعدة";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
