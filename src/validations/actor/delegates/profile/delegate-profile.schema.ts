import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type'

// =======================
// Phone Schemas
// =======================
const mobileSchema = z
    .string()
    .refine(isValidPhoneNumber, { message: 'رقم الجوال غير صالح' })

const optionalMobileSchema = z
    .string()
    .refine((val) => val === '' || isValidPhoneNumber(val), {
        message: 'رقم بديل غير صالح',
    })
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .nullable()

// =======================
// Delegate Profile Schema
// =======================
export const delegateProfileFormSchema = z.object({
    id: z.string().optional(),

    profileImage: z.string().optional().nullable(),

    name: z
        .string({ error: 'الاسم مطلوب' })
        .min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

    email: z.email({ message: 'البريد الإلكتروني غير صالح' }),

    identity: z
        .string({ error: 'رقم الهوية مطلوب' })
        .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

    gender: z.enum(GENDER, { error: 'الجنس مطلوب' }),

    nationality: z
        .string({ error: 'الجنسية مطلوبة' })
        .min(2, { message: 'الجنسية يجب أن تحتوي على 2 أحرف على الأقل' }),

    age: z
        .number({ error: 'العمر مطلوب' })
        .int()
        .min(18, { message: 'يجب أن يكون العمر 18 عامًا على الأقل' })
        .max(100, { message: 'العمر غير صالح' }),

    education: z
        .string({ error: 'المؤهل العلمي مطلوب' })
        .min(2, { message: 'المؤهل العلمي يجب أن يحتوي على 2 أحرف على الأقل' }),

    mobileNumber: mobileSchema,
    alternativeMobileNumber: optionalMobileSchema,

    socialStatus: z.enum(SOCIAL_STATUS, { error: 'الحالة الاجتماعية مطلوبة' }),

    numberOfResponsibleCamps: z.number().optional(),
    numberOfFamilies: z.number().optional(),
})

// =======================
// Type Alias
// =======================
export type TDelegateProfileFormValues = z.infer<typeof delegateProfileFormSchema>
