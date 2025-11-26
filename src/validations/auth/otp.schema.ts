import { z } from "zod";

export const otpFormSchema = z.object({
    otp: z
        .string()
        .regex(/^\d{4}$/, { message: "رمز التحقق يجب أن يتكون من 4 أرقام" }),
});

export type TOtpFormValues = z.infer<typeof otpFormSchema>;
