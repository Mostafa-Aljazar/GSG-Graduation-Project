'use server';

import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { TAid } from "@/types/actor/common/aids-management/aids-management.types";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IManageAidProps {
    payload: TAid;
    actorId?: string; // Required for add
    role?: USER_TYPE.MANAGER | USER_TYPE.DELEGATE; // Required for add
    isUpdate?: boolean; // true = update, false = add
}

const USE_FAKE = true;

export const manageAid = async ({
    payload,
    actorId,
    role,
    isUpdate = false,
}: IManageAidProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const message = isUpdate ? "تم تعديل المساعدة بنجاح" : "تم إضافة المساعدة بنجاح";
        return await new Promise(resolve => setTimeout(() => resolve({ status: 200, message }), 500));
    }

    try {
        let response;
        if (isUpdate) {
            // Update existing aid
            response = await AqsaAPI.put<IActionResponse>(`/aids/${payload.id}/update`, payload);
        } else {
            if (!actorId || !role) {
                return {
                    status: 400,
                    message: "معلومات المندوب مطلوبة لإضافة المساعدة",
                    error: "Missing actorId or role",
                };
            }
            // Add new aid
            response = await AqsaAPI.post<IActionResponse>("/aids/add", payload, {
                params: { actorId, role },
            });
        }

        if (response.data) {
            return {
                status: 200,
                message: isUpdate ? "تم تعديل المساعدة بنجاح" : "تم إضافة المساعدة بنجاح",
            };
        }

        return {
            status: 500,
            message: isUpdate ? "حدث خطأ أثناء تعديل المساعدة" : "حدث خطأ أثناء إضافة المساعدة",
            error: isUpdate ? "حدث خطأ أثناء تعديل المساعدة" : "حدث خطأ أثناء إضافة المساعدة",
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error
            ? err.message
            : isUpdate
                ? "حدث خطأ أثناء تعديل المساعدة"
                : "حدث خطأ أثناء إضافة المساعدة";

        return {
            status: 500,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
