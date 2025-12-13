'use server';

import { sendEmail } from "@/utils/send-mail";

export async function sendOTPEmail(to: string, otp: string) {
    const subject = 'رمز التحقق - OTP';
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>رمز التحقق الخاص بك</h2>
      <p>استخدم الرمز التالي لإكمال عملية تسجيل الدخول / إنشاء كلمة المرور:</p>
      <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
      <p>تنتهي صلاحية هذا الرمز خلال 15 دقيقة.</p>
    </div>
  `;
    const text = `رمز التحقق الخاص بك هو: ${otp}. صالح لمدة 15 دقيقة.`;

    try {
        await sendEmail({ to, subject, html, text });
    } catch (err) {
        console.error('Failed to send OTP email:', err);
        throw new Error('فشل في إرسال رمز التحقق عبر البريد الإلكتروني');
    }
}
