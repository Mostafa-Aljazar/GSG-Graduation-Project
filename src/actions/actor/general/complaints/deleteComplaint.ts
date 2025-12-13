"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { TUserRank, TUserType } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IDeleteComplaintFunProps {
  actorId: string;
  complaintId: string;
  role: TUserType | TUserRank;
}

const USE_FAKE = true;

export const deleteComplaint = async ({
  actorId,
  complaintId,
  role
}: IDeleteComplaintFunProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: "تم حذف الشكوى بنجاح",
  };

  if (USE_FAKE) {
    return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.delete<IActionResponse>(`/complaints/${complaintId}`, {
      data: { actorId, role },
    });

    if (response.data) return response.data;

    throw new Error("حدث خطأ أثناء حذف الشكوى");
  } catch (err: unknown) {
    let errorMessage = "حدث خطأ أثناء حذف الشكوى";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
