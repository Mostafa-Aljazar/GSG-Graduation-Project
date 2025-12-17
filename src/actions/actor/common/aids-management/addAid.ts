// 'use server';

// import { USER_TYPE } from "@/constants/user-types";
// import { AqsaAPI } from "@/services/api";
// import { TAid } from "@/types/actor/common/aids-management/aids-management.types";
// import { IActionResponse } from "@/types/common/action-response.type";

// export interface IAddAidProps {
//     payload: TAid;
//     actorId: number;
//     role: USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
// }

// const USE_FAKE = false;

// export const addAid = async ({ payload, actorId, role }: IAddAidProps): Promise<IActionResponse> => {
//     if (USE_FAKE) {
//         return new Promise(resolve =>
//             setTimeout(() => resolve({
//                 status: 200,
//                 message: "تم إضافة المساعدة بنجاح"
//             }), 500)
//         );
//     }

//     try {
//         const response = await AqsaAPI.post<IActionResponse>(
//             '/actor/common/aids-management/create',
//             payload,
//         );
//         console.log("🚀 ~ addAid ~ response:", response.data)

//         return response.data ?? {
//             status: 500,
//             message: "حدث خطأ أثناء إضافة المساعدة",
//             error: "حدث خطأ أثناء إضافة المساعدة",
//         };
//     } catch (err: unknown) {
//         const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء إضافة المساعدة";
//         return {
//             status: 500,
//             message: errorMessage,
//             error: errorMessage,
//         };
//     }
// };
