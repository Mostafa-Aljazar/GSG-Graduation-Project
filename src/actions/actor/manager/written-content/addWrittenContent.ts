'use server'

import { AqsaAPI } from "@/services/api"
import { IActionResponse } from "@/types/common/action-response.type"
import { TYPE_WRITTEN_CONTENT } from "@/types/common/index.type"


export interface IAddWrittenContentProps {
    title: string
    content: string
    brief?: string
    imageUrls?: string[]
    type: TYPE_WRITTEN_CONTENT
}

const USE_FAKE = false

export const addWrittenContent = async ({
    title,
    content,
    brief = '',
    imageUrls,
    type,
}: IAddWrittenContentProps): Promise<IActionResponse> => {
    if (USE_FAKE) {
        const fakeResponse: IActionResponse = {
            status: 200,
            message: 'تم إضافة المحتوى بنجاح',
        }

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500))
    }

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaAPI.post<IActionResponse>('/actor/common/written-contents/create', {
            title,
            content,
            brief,
            imageUrls,
            type,
        })

        if (response.status === 200) {
            return {
                status: 200,
                message: 'تم إضافة المحتوى بنجاح',
            }
        }

        return {
            status: response.status,
            message: 'حدث خطأ أثناء إضافة المحتوى',
            error: response.data?.error || 'حدث خطأ غير متوقع',
        }
    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = "حدث خطأ أثناء إضافة المحتوى";

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
