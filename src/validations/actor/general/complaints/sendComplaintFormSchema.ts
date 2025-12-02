import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { z } from "zod";

// Zod schema for form validation
export const commonSendComplaintFormSchema = z.object({
    reception: z
        .enum([USER_TYPE.MANAGER, USER_TYPE.DELEGATE, USER_RANK.SECURITY_OFFICER], {
            required_error: 'يجب اختيار جهة الاستقبال',
            invalid_type_error: 'جهة الاستقبال غير صالحة',
        })
        .nullable() // Allow null temporarily for clearable behavior
        .refine((value) => value !== null, {
            message: 'يجب اختيار جهة الاستقبال',
        }),
    title: z
        .string({ required_error: 'يجب إدخال عنوان الشكوى' })
        .min(1, { message: 'يجب إدخال عنوان الشكوى' })
        .max(100, { message: 'عنوان الشكوى يجب ألا يتجاوز 100 حرف' }),
    content: z
        .string({ required_error: 'يجب إدخال محتوى الشكوى' })
        .min(1, { message: 'يجب إدخال محتوى الشكوى' })
        .max(1000, { message: 'محتوى الشكوى يجب ألا يتجاوز 1000 حرف' }),
});

// Type inferred from the schema
export type TCommonSendComplaintFormValues = z.infer<
    typeof commonSendComplaintFormSchema
>;
