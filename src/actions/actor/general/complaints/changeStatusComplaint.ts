"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface IChangeStatusComplaintProps {
  actorReceiverId: string;
  complaintId: string;
  roleReceiver: USER_RANK.SECURITY_OFFICER | USER_TYPE.MANAGER | USER_TYPE.DELEGATE;
}

const USE_FAKE = true;

export const changeStatusComplaint = async ({
  actorReceiverId,
  complaintId,
  roleReceiver,
}: IChangeStatusComplaintProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: "تم تغيير حالة الشكوى بنجاح",
  };

  if (USE_FAKE) {
    return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.put<IActionResponse>(
      `/complaints/${complaintId}/change-status`,
      { actorReceiverId, roleReceiver }
    );

    if (response.data) return response.data;

    throw new Error("حدث خطأ أثناء تغيير حالة الشكوى");
  } catch (err: unknown) {
    let errorMessage = "حدث خطأ أثناء تغيير حالة الشكوى";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
