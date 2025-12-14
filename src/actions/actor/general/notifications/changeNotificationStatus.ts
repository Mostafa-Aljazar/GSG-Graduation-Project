"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { TUserType } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IChangeNotificationStatusProps {
    actorId: string;
    role: TUserType;
    notificationId: string;
}

const USE_FAKE = true;

export const changeNotificationStatus = async ({
    actorId,
    role,
    notificationId,
}: IChangeNotificationStatusProps): Promise<IActionResponse> => {
    /////////////////////////////////////////////////////////////
    // FAKE DATA
    /////////////////////////////////////////////////////////////
    if (USE_FAKE) {
        const fakeData: IActionResponse = {
            status: 200,
            message: "تم تغيير حالة الاشعار بنجاح",
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>(
            "/notifications/change-status",
            { actorId, role, notificationId }
        );

        if (response.data) {
            return {
                status: 200,
                message: "تم تغيير حالة الاشعار بنجاح",
            };
        }

        throw new Error("حدث خطأ أثناء تغيير حالة الاشعار");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء تغيير حالة الاشعار";
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
