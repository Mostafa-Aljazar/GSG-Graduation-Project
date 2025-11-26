import { z } from "zod";

export const createNewPasswordFormSchema = z
    .object({
        password: z
            .string({ message: 'الحقل مطلوب' })
            .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'كلمات المرور غير متطابقة',
        path: ['confirm_password'],
    });

export type TCreateNewPasswordFormValues = z.infer<typeof createNewPasswordFormSchema>;
