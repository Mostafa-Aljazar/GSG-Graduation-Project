
import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';
import { USER_TYPE, USER_RANK } from '@/constants/user-types';

// =======================
// Phone Schemas
// =======================
const mobileSchema = z
    .string()
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
// Security Profile Schema
// =======================
export const securityProfileFormSchema = z.object({
    id: z.string().optional(),

    profileImage: z.string().optional().nullable(),

    name: z
        .string({ error: 'الاسم مطلوب' })
        .min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),

    identity: z
        .string({ error: 'رقم الهوية مطلوب' })
        .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

    nationality: z
        .string({ error: 'الجنسية مطلوبة' })
        .min(2, { message: 'الجنسية يجب أن تحتوي على حرفين على الأقل' }),

    gender: z.nativeEnum(GENDER, { error: 'الجنس مطلوب' }),

    mobileNumber: mobileSchema,

    alternativeMobileNumber: optionalMobileSchema,

    role: z.literal(USER_TYPE.SECURITY_PERSON),

    rank: z.nativeEnum(USER_RANK, { error: 'الرتبة مطلوبة' }).refine(
        (r) =>
            r === USER_RANK.SECURITY_PERSON ||
            r === USER_RANK.SECURITY_OFFICER,
        { message: 'رتبة غير مسموحة' }
    ),

    socialStatus: z.nativeEnum(SOCIAL_STATUS, {
        error: 'الحالة الاجتماعية مطلوبة',
    }),

    additionalNotes: z.string().optional().nullable(),
});

// =======================
// Type Alias
// =======================
export type TSecurityProfileFormValues = z.infer<
    typeof securityProfileFormSchema
>;
