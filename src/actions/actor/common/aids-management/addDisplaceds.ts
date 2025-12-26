'use server';

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";

export interface IAddAidDisplacedsProps {
    aidId: string;
    displacedIds: string[]
}

const USE_FAKE = false;

export const addAidDisplaceds = async ({ aidId, displacedIds }: IAddAidDisplacedsProps): Promise<IActionResponse> => {

    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: "تم إضافة النازحين للمساعدة بنجاح",
        };
        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {

        const response = await AqsaAPI.post<IActionResponse>(`/actor/common/aids-management/${aidId}/add-displaceds`,
            { displacedIds },
        );

        if (response.data) {
            return {
                status: 200,
                message: "تم إضافة النازحين للمساعدة بنجاح",
            };
        }

        return {
            status: 500,
            message: "حدث خطأ أثناء إضافة النازحين للمساعدة",
            error: "حدث خطأ أثناء إضافة النازحين للمساعدة",
        };

    } catch (err: unknown) {
        let errorMessage = "حدث خطأ أثناء إضافة النازحين للمساعدة";
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
