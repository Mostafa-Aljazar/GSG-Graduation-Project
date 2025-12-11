'use server'

import { fakeDelegatesResponse } from "@/content/actor/delegates/fake-data/fake-delegates"
import { AqsaAPI } from "@/services/api"
import { IDelegatesResponse } from "@/types/actor/general/delegates/delegates-response.type"

export interface IGetDelegatesProps {
    page?: number
    limit?: number
}

const USE_FAKE = false

export const getDelegates = async ({
    page = 1,
    limit = 15
}: IGetDelegatesProps): Promise<IDelegatesResponse> => {
    if (USE_FAKE) {
        const fakeData = fakeDelegatesResponse({ page, limit })
        return new Promise(resolve => setTimeout(() => resolve(fakeData), 500))
    }

    try {
        const response = await AqsaAPI.get<IDelegatesResponse>('/actor/delegates', {
            params: { page, limit }
        })

        return response.data
    } catch (err: any) {
        const message = err?.message || 'حدث خطأ أثناء جلب بيانات المناديب'

        return {
            status: 500,
            message,
            delegates: [],
            pagination: {
                page: 1,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            },
            error: message
        }
    }
}
