import { USER_RANK, USER_TYPE } from '@/constants/user-types';
import { z } from 'zod';

// Zod schema for form validation
export const commonSendComplaintFormSchema = z.object({

  reception: z
  .enum([
    USER_TYPE.MANAGER,
    USER_TYPE.DELEGATE,
    USER_RANK.SECURITY_OFFICER,
  ])
  .nullable()
  .refine((value) => value !== null, {
    message: "يجب اختيار جهة الاستقبال",
  }),
  title: z.string()
  .min(1, { message: "يجب إدخال عنوان الشكوى" })
  .max(100, { message: "عنوان الشكوى يجب ألا يتجاوز 100 حرف" }),

  content: z.string()
  .min(1, { message: "يجب إدخال محتوى الشكوى" })
  .max(1000, { message: "محتوى الشكوى يجب ألا يتجاوز 1000 حرف" }),

});

// Type inferred from the schema
export type TCommonSendComplaintFormValues = z.infer<typeof commonSendComplaintFormSchema>;
