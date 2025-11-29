'use server';


interface getDelegatesNamesProps {
    ids?: number[];
}

export const getDelegatesNames = async ({ ids }: getDelegatesNamesProps): Promise<DelegatesNamesResponse> => {

    const fakeData = fakeDelegatesNamesResponse({ ids });

    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeData);
        }, 500);
    });

    /////////////////////////////////////////////////////////////
    // FIXME: THIS IS THE REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    // try {
    //     const response = await AqsaAPI.get<DelegatesNamesResponse>('/delegates/names', {
    //         params: { ids }
    //     });

    //     if (response.data?.delegate_names) {
    //         return response.data
    //     }

    //     throw new Error("فشل في تحميل بيانات المناديب");

    // } catch (error: any) {
    //     const errorMessage = error.response?.data?.error || error.message || "حدث خطأ أثناء تحميل بيانات المناديب";
    //     return {
    //         status: error.response?.status || 500,
    //         message: errorMessage,
    //         delegate_names: [],
    //         error: errorMessage,
    //     };
    // }

};
