'use server';

import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { TAid } from "@/types/actor/common/aids-management/aids-management.types";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IManageAidProps {
    payload: TAid;
    actorId?: string; // required for add
    role?: USER_TYPE.MANAGER | USER_TYPE.DELEGATE; // required for add
    isUpdate?: boolean; // true = update, false = add
}

const USE_FAKE = false;

export const manageAid = async ({
    payload,
    actorId,
    role,
    isUpdate = false,
}: IManageAidProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const message = isUpdate ? "تم تعديل المساعدة بنجاح" : "تم إضافة المساعدة بنجاح";
        return new Promise(resolve => setTimeout(() => resolve({ status: 200, message }), 500));
    }

    if (!isUpdate && (!actorId || !role)) {
        return {
            status: 400,
            message: "معلومات المندوب مطلوبة لإضافة المساعدة",
            error: "Missing actorId or role",
        };
    }

    try {
        // src\app\api\actor\common\aids - management\create
        const response = isUpdate
            ? await AqsaAPI.put<IActionResponse>(`/actor/common/aids-management/${payload.id}/update`, { payload })
            : await AqsaAPI.post<IActionResponse>("/actor/common/aids-management/create", { payload },
            );

        if (response.data) {
            return {
                status: 200,
                message: isUpdate ? "تم تعديل المساعدة بنجاح" : "تم إضافة المساعدة بنجاح",
                // ...response.data,
            };
        }

        const fallbackMessage = isUpdate
            ? "حدث خطأ أثناء تعديل المساعدة"
            : "حدث خطأ أثناء إضافة المساعدة";

        return { status: 500, message: fallbackMessage, error: fallbackMessage };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error
            ? err.message
            : isUpdate
                ? "حدث خطأ أثناء تعديل المساعدة"
                : "حدث خطأ أثناء إضافة المساعدة";

        return { status: 500, message: errorMessage, error: errorMessage };
    }
};
