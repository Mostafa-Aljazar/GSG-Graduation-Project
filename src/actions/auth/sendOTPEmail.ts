'use server';

import { AUTH_ROUTES } from "@/constants/routes";
import { sendEmail } from "@/utils/send-mail";

export async function sendOTPEmail(to: string, otp: string, time: number = 15): Promise<void> {
  const subject = 'رمز التحقق - OTP';
  const otpUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/otp?email=${encodeURIComponent(to)}&otp=${encodeURIComponent(otp)}&callback=${AUTH_ROUTES.CREATE_NEW_PASSWORD}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>رمز التحقق الخاص بك</h2>
      <p>استخدم الرابط التالي لإكمال عملية تسجيل الدخول / إنشاء كلمة المرور:</p>
      <p style="font-size: 16px; font-weight: bold; color: #333;">
        <a href="${otpUrl}">${otpUrl}</a>
      </p>
      <p>تنتهي صلاحية هذا الرمز خلال 15 دقيقة.</p>
    </div>
  `;

  const text = `رمز التحقق الخاص بك هو: ${otp}. صالح لمدة ${time} دقيقة. استخدم الرابط: ${otpUrl}`;

  try {
    await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    throw new Error('فشل في إرسال رمز التحقق عبر البريد الإلكتروني');
  }
}
