import { GENDER, SOCIAL_STATUS } from '@/types/common/actors-information.type';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const ManagerProfileSchema = z.object({
  // avatar: z.instanceof(File).optional().nullable(),
  profile_image: z.string().optional().nullable(),

  name: z
    .string({ required_error: 'الاسم مطلوب' })
    .min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

  email: z.string().email(),

  identity: z
    .string({ required_error: 'رقم الهوية مطلوب' })
    .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

  gender: z.nativeEnum(GENDER, { required_error: 'الجنس مطلوب' }),

  nationality: z
    .string({ required_error: 'الجنسية مطلوبة' })
    .min(2, { message: 'الجنسية يجب أن تحتوي على 2 أحرف على الأقل' }),

  social_status: z.nativeEnum(SOCIAL_STATUS, {
    required_error: 'الحالة الاجتماعية مطلوبة',
  }),

  phone_number: z
    .string({ required_error: 'رقم الجوال مطلوب' })
    .refine(isValidPhoneNumber, { message: 'رقم الجوال غير صالح' }),

  alternative_phone_number: z
    .string()
    .refine((val) => val === '' || isValidPhoneNumber(val), {
      message: 'رقم بديل غير صالح',
    })
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .nullable(),
});

export type ManagerProfileType = z.infer<typeof ManagerProfileSchema>;
