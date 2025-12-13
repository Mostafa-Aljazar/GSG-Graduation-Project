import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ACCOMMODATION_TYPE, AGES, FAMILY_STATUS_TYPE, GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';

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
// Displaced Profile Schema
// =======================
export const displacedProfileFormSchema = z.object({
    id: z.string().optional(),

    profileImage: z.string().optional().nullable(),

    name: z.string({ error: 'الاسم مطلوب' }).min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),

    identity: z
        .string({ error: 'رقم الهوية مطلوب' })
        .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

    gender: z.nativeEnum(GENDER, { error: 'الجنس مطلوب' }),

    nationality: z.string({ error: 'الجنسية مطلوبة' }).min(2, { message: 'الجنسية يجب أن تحتوي على 2 أحرف على الأقل' }),

    originalAddress: z.string({ error: 'العنوان الأصلي مطلوب' }).min(2, { message: 'العنوان يجب أن يحتوي على حرفين على الأقل' }),

    mobileNumber: mobileSchema,
    alternativeMobileNumber: optionalMobileSchema,

    wives: z.array(
        z.object({
            name: z.string({ error: 'اسم الزوجة مطلوب' }).min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),
            identity: z
                .string({ error: 'رقم هوية الزوجة مطلوب' })
                .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),
            nationality: z.string({ error: 'جنسية الزوجة مطلوبة' }).min(2, { message: 'الجنسية يجب أن تحتوي على حرفين على الأقل' }),
            isPregnant: z.boolean(),
            isWetNurse: z.boolean(),
        })
    ),

    socialStatus: z.object({
        status: z.enum(SOCIAL_STATUS, { error: 'الحالة الاجتماعية مطلوبة' }),
        numberOfWives: z.number().int().min(0),
        numberOfMales: z.number().int().min(0),
        numberOfFemales: z.number().int().min(0),
        totalFamilyMembers: z.number().int().min(1),
        ageGroups: z.record(z.enum(AGES), z.number().int().min(0)),
    }),

    displacement: z.object({
        tentNumber: z.string({ error: 'رقم الخيمة مطلوب' }).min(1, { message: 'رقم الخيمة لا يمكن أن يكون فارغًا' }),
        tentType: z.nativeEnum(ACCOMMODATION_TYPE, { error: 'نوع الخيمة مطلوب' }),
        familyStatusType: z.nativeEnum(FAMILY_STATUS_TYPE, { error: 'حالة الأسرة مطلوبة' }),
        displacementDate: z
            .string({ error: 'تاريخ النزوح مطلوب' })
            .refine((date) => !isNaN(Date.parse(date)), { message: 'تاريخ النزوح غير صالح' }),
        delegate: z.object({
            id: z.string(),
            name: z.string(),
        }),
    }),

    warInjuries: z.array(
        z.object({
            name: z.string({ error: 'اسم المصاب مطلوب' }),
            injury: z.string({ error: 'وصف الإصابة مطلوب' }),
        })
    ),

    martyrs: z.array(
        z.object({
            name: z.string({ error: 'اسم الشهيد مطلوب' }),
        })
    ),

    medicalConditions: z.array(
        z.object({
            name: z.string({ error: 'اسم المريض مطلوب' }),
            condition: z.string({ error: 'نوع الحالة الطبية مطلوب' }),
        })
    ),

    additionalNotes: z.string().optional().nullable(),
});

// =======================
// Type Alias
// =======================
export type TDisplacedProfileFormValues = z.infer<typeof displacedProfileFormSchema>;
