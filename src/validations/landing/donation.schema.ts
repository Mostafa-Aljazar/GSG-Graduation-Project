import { z } from 'zod';

export const donationFormSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون 2 أحرف على الأقل' }).trim(),

  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).trim(),

  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'السعر يجب أن يكون رقم أكبر من 0',
    })
    .transform(Number),

  message: z.string().min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' }).trim(),
});

export type TDonationFormType = z.infer<typeof donationFormSchema>;
