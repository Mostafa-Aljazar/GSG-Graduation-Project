"use server";

import { fakeDelegatesByIdsResponse } from "@/content/actor/delegate/delegate-data";
import { DelegatesResponse } from "@/types/delegate/general/delegate-response.type";



export interface getDelegatesByIdsProps {
    Ids: number[];
    page?: number;
    limit?: number;
};

export const getDelegatesByIds = async ({
    Ids,
    page = 1,
    limit = 7,
}: getDelegatesByIdsProps): Promise<DelegatesResponse> => {

    const fakeResponse = fakeDelegatesByIdsResponse({ Ids, page, limit })
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeResponse);
        }, 500);
    });

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    // try {

    //     const response = await AqsaAPI.get<DelegatesResponse>("/delegates/by-ids",
    //         {
    //             params: {
    //                 page, limit, Ids
    //             }
    //         });

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