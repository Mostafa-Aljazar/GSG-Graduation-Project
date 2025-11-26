import { USER_TYPE } from "@/constants/user-types";
import z from "zod";

export const loginFormSchema = z.object({
    userType: z.enum(USER_TYPE).refine(
        (val) => Object.values(USER_TYPE).includes(val),
        { message: "الرجاء اختيار نوع المستخدم صحيح" }
    ),
    email: z
        .string()
        .min(1, { message: "حقل البريد الإلكتروني مطلوب" })
        .email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
    password: z
        .string()
        .min(6, { message: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل" }),
});

export type TLoginFormValues = z.infer<typeof loginFormSchema>;
