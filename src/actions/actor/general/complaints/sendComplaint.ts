"use server";

import { IActionResponse } from "@/types/common/action-response.type";
import { USER_TYPE } from "@/constants/user-types";
import { AqsaAPI } from "@/services/api";

export interface ISendComplaintProps {
  actorId: string;
  role: USER_TYPE.DELEGATE | USER_TYPE.DISPLACED | USER_TYPE.SECURITY_PERSON;
  reception: USER_TYPE.MANAGER | USER_TYPE.DELEGATE | USER_TYPE.SECURITY_PERSON;
  title: string;
  content: string;
}

const USE_FAKE = true;

export const sendComplaint = async ({
  actorId,
  role,
  reception,
  title,
  content,
}: ISendComplaintProps): Promise<IActionResponse> => {
  const fakeResponse: IActionResponse = {
    status: 200,
    message: "تم ارسال الشكوى بنجاح",
  };

  if (USE_FAKE) {
    return await new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
  }

  /////////////////////////////////////////////////////////////
  // REAL IMPLEMENTATION
  /////////////////////////////////////////////////////////////
  try {
    const response = await AqsaAPI.post<IActionResponse>("/complaints/send-complaint", {
      actorId,
      role,
      reception,
      title,
      content,
    });

    if (response.data) return response.data;

    throw new Error("حدث خطأ أثناء ارسال الشكوى");
  } catch (err: unknown) {

    let errorMessage = "حدث خطأ أثناء ارسال الشكوى";
    const statusCode = 500;

    if (err instanceof Error) errorMessage = err.message;

    return {
      status: statusCode,
      message: errorMessage,
      error: errorMessage,
    };
  }
};
