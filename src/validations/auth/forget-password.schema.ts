import { z } from "zod";

export const forgetPasswordFormSchema = z.object({
    email: z.email({ message: 'البريد الإلكتروني غير صالح' })
});

export type TForgetPasswordFormValues = z.infer<typeof forgetPasswordFormSchema>;

