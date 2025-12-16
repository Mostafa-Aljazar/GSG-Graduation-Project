"use server";

import { AqsaAPI } from "@/services/api";
import { TUserRank, TUserType } from "@/constants/user-types";
import { fakeComplaintsResponse } from "@/content/actor/complaints/fake-data/fake-complaints";
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from "@/types/actor/common/index.type";
import { IComplaintsResponse } from "@/types/actor/general/complaints/complaints-response.type";

export interface IGetComplaintsProps {
    page?: number;
    limit?: number;
    status?: COMPLAINTS_STATUS;
    dateRange?: [string | null, string | null];
    search?: string;
    complaintType: COMPLAINTS_TABS;
    // get the complaints of already user complaints
    userAlreadyId: string;
    userAlreadyType: TUserType | TUserRank;

}

const USE_FAKE = false;

export const getComplaints = async ({
    page = 1,
    limit = 5,
    status,
    dateRange = [null, null],
    search = "",
    complaintType,

    userAlreadyId,
    userAlreadyType,

}: IGetComplaintsProps): Promise<IComplaintsResponse> => {
    if (USE_FAKE) {
        const fakeResponse = fakeComplaintsResponse({
            page,
            limit,
            status,
            dateRange,
            search,
            complaintType,
            userAlreadyId,
            userAlreadyType,

        });

        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        //src\app\api\actor\common\complaints\route.ts
        const response = await AqsaAPI.get<IComplaintsResponse>("/actor/common/complaints", {
            params: {
                userAlreadyId,
                userAlreadyType,
                page,
                limit,
                complaintType,
                status,
                dateRange,
                search: search.trim(),
            },
        });

        if (response.data?.complaints) return response.data;

        throw new Error("بيانات الشكاوى غير متوفرة");
    } catch (err: unknown) {

        let errorMessage = "حدث خطأ أثناء جلب الشكاوى";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;


        return {
            status: statusCode,
            message: errorMessage,
            complaints: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: errorMessage,
        };
    }
};
