"use server";

import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";


export interface IReceiveDisplacedAidProps {
    receiveCode: string;
    aidId: string;
    displacedId: string;
    actorId: string;
    role: USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
}

const USE_FAKE = false;

export const receiveDisplacedAid = async ({
    receiveCode,
    aidId,
    displacedId,
    role,
    actorId,
}: IReceiveDisplacedAidProps): Promise<IActionResponse> => {


    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم تسليم المساعدة بنجاح`,
        };
        return await new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    ////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    ////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>(`/actor/common/aids-management/${aidId}/receive-aid`, {
            receiveCode,
            aidId,
            displacedId,
            role,
            actorId,
        });

        if (response.data) {
            return {
                status: 200,
                message: `تم تسليم المساعدة بنجاح`,
            };
        }

        throw new Error("حدث خطأ أثناء تسليم المساعدة");

        return {
            status: 500,
            message: "حدث خطأ أثناء تسليم المساعدة",
            error: "حدث خطأ أثناء تسليم المساعدة"
        };

    } catch (err: unknown) {

        let errorMessage = "حدث خطأ أثناء تسليم المساعدة"
        const statusCode = 500;

        if (err instanceof Error) errorMessage = err.message;

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
