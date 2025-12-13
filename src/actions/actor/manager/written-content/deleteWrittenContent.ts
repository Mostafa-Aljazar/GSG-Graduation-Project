'use server';

import { AqsaAPI } from "@/services/api";
import { IActionResponse } from "@/types/common/action-response.type";
import { TYPE_WRITTEN_CONTENT } from "@/types/common/index.type";

export interface IDeleteWrittenContentProps {
    contentId: string;
    managerId: string;
    type: TYPE_WRITTEN_CONTENT;
}

const USE_FAKE = false;

export const deleteWrittenContent = async ({
    contentId,
    managerId,
    type,
}: IDeleteWrittenContentProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: `تم حذف المحتوى بنجاح`,
        };

        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        );
    }

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////

    try {
        const id = contentId;
        const response = await AqsaAPI.delete<IActionResponse>(`/actor/common/written-contents/${id}`,
            // {
            //     params: { type }
            // }
        );

        if (
            (response.data.error && response.data.error.length > 0) ||
            response.status !== 200
        ) {
            throw new Error(
                response.data.error || "حدث خطأ أثناء حذف المحتوى"
            );
        }

        return {
            status: 200,
            message: `تم حذف المحتوى بنجاح`,
        };
    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "حدث خطأ أثناء حذف المحتوى";

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        };
    }
};
