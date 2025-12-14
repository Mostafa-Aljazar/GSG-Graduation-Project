"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { TUserType } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IchangeNotificationStatusProps {
    actor_Id: number
    role: TUserType
    notification_Id: number
}

export const changeNotificationStatus = async ({
    actor_Id,
    role,
    notification_Id,
}: IchangeNotificationStatusProps): Promise<IActionResponse> => {
    const fakeResponse: IActionResponse = {
        status: 200,
        message: "تم تغيير حالة الاشعار بنجاح"
    }

    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeResponse);
        }, 500);
    });


    // FIXME: THIS IS THE REAL IMPLEMENTATION
    try {

        const response = await AqsaAPI.post<IActionResponse>("/notifications/change-status", {
            actor_Id,
            role,
            notification_Id,
        });

        if (response.data) {
            return {
                status: 200,
                message: "تم تغيير حالة الاشعار بنجاح"
            };
        }

        throw new Error("حدث خطأ أثناء تغيير حالة الاشعار");

    } catch (error: any) {
        const errorMessage =
            error.response?.data?.error || error.message || "حدث خطأ أثناء تغيير حالة الاشعار";
        return {
            status: error.response?.status || 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};