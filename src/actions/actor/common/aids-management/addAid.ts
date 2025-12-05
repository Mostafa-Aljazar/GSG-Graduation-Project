'use server';

import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { TAid } from "@/types/actor/common/aids-management/aids-management.types";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IAddAidProps {
    payload: TAid;
    actorId: number;
    role: USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
}

const USE_FAKE = true;

export const addAid = async ({ payload, actorId, role }: IAddAidProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم إضافة المساعدة بنجاح",
        };
        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>('/aids/add', payload, {
            params: { actorId, role },
        });

        if (response.data) {
            return {
                status: 200,
                message: "تم إضافة المساعدة بنجاح",
            };
        }

        return {
            status: 500,
            message: "حدث خطأ أثناء إضافة المساعدة",
            error: "حدث خطأ أثناء إضافة المساعدة",
        };

    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء إضافة المساعدة";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
