import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { GENDER, SOCIAL_STATUS } from '@/types/common/actors-information.type';

const phoneSchema = z
    .string()
    .refine(isValidPhoneNumber, { message: 'رقم الجوال غير صالح' });

const optionalPhoneSchema = z
    .string()
    .refine((val) => val === '' || isValidPhoneNumber(val), {
        message: 'رقم بديل غير صالح',
    })
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .nullable();

export const DelegateProfileSchema = z.object({
    id: z.number().optional(), // optional for create

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

    phone_number: phoneSchema,

    alternative_phone_number: optionalPhoneSchema,

    social_status: z.nativeEnum(SOCIAL_STATUS, {
        required_error: 'الحالة الاجتماعية مطلوبة',
    }),

    age: z
        .number({ required_error: 'العمر مطلوب' })
        .int()
        .min(18, { message: 'يجب أن يكون العمر 18 عامًا على الأقل' })
        .max(100, { message: 'العمر غير صالح' }),

    education: z
        .string({ required_error: 'المؤهل العلمي مطلوب' })
        .min(2, { message: 'المؤهل العلمي يجب أن يحتوي على 2 أحرف على الأقل' }),

})

export type DelegateProfileSchemaType = z.infer<typeof DelegateProfileSchema>
