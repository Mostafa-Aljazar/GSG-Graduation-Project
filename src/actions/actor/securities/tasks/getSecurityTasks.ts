'use server';

import { fakeTasksResponse } from "@/content/actor/security/fake-data/fake-security-tasks";
import { AqsaAPI } from "@/services/api";
import { TASKS_TABS } from "@/types/actor/common/index.type";
import { ITasksResponse } from "@/types/actor/security/tasks/TasksResponse.type";

export interface IGetSecuritiesTasksProps {
    page?: number;
    limit?: number;
    taskType: TASKS_TABS;
}

const USE_FAKE = false;

export const getSecurityTasks = async ({
    page = 1,
    limit = 5,
    taskType,
}: IGetSecuritiesTasksProps): Promise<ITasksResponse> => {
    if (USE_FAKE) {
        const fakeData: ITasksResponse = fakeTasksResponse({ page, limit, taskType });
        return new Promise((resolve) => setTimeout(() => resolve(fakeData), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.get<ITasksResponse>("/actor/securities/tasks", {
            params: { page, limit, taskType },
        });

        console.log("🚀 ~ getSecurityTasks ~ response.data:", response.data)
        if (response.data) return response.data;

        throw new Error("بيانات المهام غير متوفرة");
    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء جلب بيانات المهام";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            tasks: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: errorMessage,
        };
    }
};
