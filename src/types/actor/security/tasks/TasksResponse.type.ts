import { IPagination } from "@/types/common/pagination.type";
import { TASKS_TABS } from "../../common/index.type";


export interface ITask {
    id: number;
    dateTime: Date;
    title: string;
    body: string;
    securitiesIds: number[]
    type: TASKS_TABS;
}

export interface ITasksResponse {
    status: number;
    message?: string;
    tasks: ITask[];
    pagination: IPagination;
    error?: string;
}
