import { z } from "zod";
import { isValidPhoneNumber } from 'react-phone-number-input';

export const contactUsSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'الاسم يجب أن يكون 2 أحرف على الأقل' })
        .trim(),

    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).trim(),

    phone_number: z
        .string({ message: 'رقم الجوال مطلوب' })
        .refine(isValidPhoneNumber, { message: 'رقم الجوال غير صالح' }),


    message: z
        .string()
        .min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' })
        .trim(),
});

export type TContactUsType = z.infer<typeof contactUsSchema>;
