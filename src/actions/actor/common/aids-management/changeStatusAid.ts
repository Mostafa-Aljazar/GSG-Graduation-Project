'use server';

import { AqsaAPI } from "@/services/api";
import { TYPE_GROUP_AIDS } from "@/types/actor/common/index.type";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IChangeStatusAidProps {
    aidId: string;
    aidGroup: TYPE_GROUP_AIDS
}

const USE_FAKE = false;

export const changeStatusAid = async ({ aidId, aidGroup }: IChangeStatusAidProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم  تغيير المساعدة الى مساعدة جارية بنجاح",
        };
        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.put<IActionResponse>(`/actor/common/aids-management/${aidId}/changeStatus`
            , {
                aidGroup
            });

        if (response.data) {
            return {
                status: 200,
                message: "تم  تغيير حالة المساعدة  بنجاح",
            };
        }

        return {
            status: 500,
            message: "حدث خطأ أثناء تغيير حالة المساعدة",
            error: "حدث خطأ أثناء تغيير حالة المساعدة",
        };

    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تغيير حالة المساعدة";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
