'use server'

import { AqsaAPI } from "@/services/api"
import { IActionResponse } from "@/types/common/action-response.type"
import { TYPE_WRITTEN_CONTENT } from "@/types/common/index.type"


export interface IUpdateWrittenContentProps {
    id: number
    title: string
    content: string
    brief?: string
    imageUrls?: string[]
    type: TYPE_WRITTEN_CONTENT
}

const USE_FAKE = true

export const updateWrittenContent = async ({
    id,
    title,
    content,
    brief = '',
    imageUrls,
    type,
}: IUpdateWrittenContentProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: 'تم تحديث المحتوى بنجاح',
        }

        return new Promise((resolve) =>
            setTimeout(() => resolve(fakeResponse), 500)
        )
    }

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.put<IActionResponse>(`/written-content/${id}`, {
            title,
            content,
            brief,
            imageUrls,
            type,
        })

        if (response.status === 200) {
            return {
                status: 200,
                message: 'تم تحديث المحتوى بنجاح',
            }
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء تحديث المحتوى',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        }
    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "حدث خطأ أثناء تحديث المحتوى";

        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return {
            status: statusCode,
            message: errorMessage,
            error: errorMessage,
        }
    }
}
