'use server';

import { TASKS_TABS } from "@/types/actor/common/index.type";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface ISecurityTaskProps {
    taskId?: number;
    dateTime: Date;
    title: string;
    body: string;
    securitiesIds: number[];
    type: TASKS_TABS;
}

const USE_FAKE = true;

export const saveSecurityTask = async ({
    taskId,
    dateTime,
    title,
    body,
    securitiesIds,
    type,
}: ISecurityTaskProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeMessage = taskId
            ? "تم تعديل المهمة بنجاح"
            : "تم اضافة المهمة بنجاح";

        const fakeResponse: IActionResponse = {
            status: 200,
            message: fakeMessage,
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    try {
        const payload = {
            dateTime,
            title,
            body,
            securitiesIds,
            type,
        };

        const response = taskId
            ? await AqsaAPI.put<IActionResponse>(`/securities/tasks/${taskId}`, payload)
            : await AqsaAPI.post<IActionResponse>('/securities/tasks/add', payload);

        const successStatus = taskId ? 200 : 201;
        const successMessage = taskId
            ? "تم تعديل المهمة بنجاح"
            : "تم اضافة المهمة بنجاح";

        if (response.data.status === successStatus) {
            return {
                status: successStatus,
                message: successMessage,
            };
        }

        return {
            status: response.status,
            message: "حدث خطأ أثناء حفظ المهمة",
            error: response.data?.error || "حدث خطأ غير متوقع",
        };

    } catch (error: any) {
        let errorMessage = taskId
            ? "حدث خطأ أثناء تعديل المهمة"
            : "حدث خطأ أثناء اضافة المهمة";

        const statusCode = 500;

        if (error instanceof Error) errorMessage = error.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
