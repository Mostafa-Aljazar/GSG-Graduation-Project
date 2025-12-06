import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';

// =======================
// Phone Schemas
// =======================
const mobileSchema = z
  .string({ error: 'رقم الجوال مطلوب' })
  .refine(isValidPhoneNumber, { message: 'رقم الجوال غير صالح' });

const optionalMobileSchema = z
  .string()
  .refine((val) => val === '' || isValidPhoneNumber(val), {
    message: 'رقم بديل غير صالح',
  })
  .transform((val) => (val === '' ? undefined : val))
  .optional()
  .nullable();

// =======================
// Manager Profile Schema
// =======================
export const ManagerProfileSchema = z.object({
  id: z.number().optional(),

  profileImage: z.string().optional().nullable(),

  name: z
    .string({ error: 'الاسم مطلوب' })
    .min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),

  identity: z
    .string({ error: 'رقم الهوية مطلوب' })
    .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

  gender: z.nativeEnum(GENDER, { error: 'الجنس مطلوب' }),

  nationality: z
    .string({ error: 'الجنسية مطلوبة' })
    .min(2, { message: 'الجنسية يجب أن تحتوي على حرفين على الأقل' }),

  socialStatus: z.nativeEnum(SOCIAL_STATUS, {
    error: 'الحالة الاجتماعية مطلوبة',
  }),

  mobileNumber: mobileSchema,

  alternativeMobileNumber: optionalMobileSchema,
});

// =======================
// Type Alias
// =======================
export type TManagerProfileFormValues = z.infer<typeof ManagerProfileSchema>;
