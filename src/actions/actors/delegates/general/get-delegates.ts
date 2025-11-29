"use server";

import { fakeDelegatesResponse } from "@/content/actor/delegate/delegate-data";
import { DelegatesResponse } from "@/types/delegate/general/delegate-response.type";



export interface getDelegatesProps {
    page?: number;
    limit?: number;
};

export const getDelegates = async ({ page = 1, limit = 15 }: getDelegatesProps): Promise<DelegatesResponse> => {

    const fakeData: DelegatesResponse = fakeDelegatesResponse({ page, limit });
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeData);
        }, 500);
    });

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    // try {

    //     const response = await AqsaAPI.get<DelegatesResponse>("/delegates", {
    //         params: {
    //             page, limit
    //         }
    //     }
    //     );

    //     if (response.data?.delegates) {
    //         return response.data
    //     }

    //     throw new Error("بيانات المناديب غير متوفرة");

    // } catch (error: any) {

    //     const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء جلب بيانات المناديب";

    //     return {
    //         status: error.response?.status || 500,
    //         message: errorMessage,
    //         delegates: [],
    //         pagination: {
    //             page: 1,
    //             limit: 0,
    //             total_items: 0,
    //             total_pages: 0,
    //         },
    //         error: errorMessage,
    //     };
    // }
};