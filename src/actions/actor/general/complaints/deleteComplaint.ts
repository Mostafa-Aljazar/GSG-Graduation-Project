'use server';

import { IActionResponse } from "@/types/common/action-response.type";
import { AqsaAPI } from "@/services/api";

export interface IDeleteComplaintFunProps {
  complaintId: string;
}

const USE_FAKE = false;

export const deleteComplaint = async ({
  complaintId,
}: IDeleteComplaintFunProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: "تم حذف الشكوى بنجاح",
  };

  if (USE_FAKE) {
    return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  try {
    const response = await AqsaAPI.delete<IActionResponse>(`/actor/common/complaints/${complaintId}`);
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
