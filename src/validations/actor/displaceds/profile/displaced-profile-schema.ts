import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
    GENDER,
    SOCIAL_STATUS,
    AGES,
    ACCOMMODATION_TYPE,
    FAMILY_STATUS_TYPE,
} from '@/types/common/actors-information.type';

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

export const displacedProfileSchema = z.object({
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

    original_address: z
        .string({ required_error: 'العنوان الأصلي مطلوب' })
        .min(2, { message: 'العنوان يجب أن يحتوي على حرفين على الأقل' }),

    phone_number: phoneSchema,

    alternative_phone_number: optionalPhoneSchema,

    wives: z.array(
        z.object({
            name: z
                .string({ required_error: 'اسم الزوجة مطلوب' })
                .min(2, { message: 'الاسم يجب أن يحتوي على حرفين على الأقل' }),

            identity: z
                .string({ required_error: 'رقم هوية الزوجة مطلوب' })
                .regex(/^\d{9}$/, { message: 'رقم الهوية يجب أن يكون 9 أرقام' }),

            nationality: z
                .string({ required_error: 'جنسية الزوجة مطلوبة' })
                .min(2, { message: 'الجنسية يجب أن تحتوي على حرفين على الأقل' }),

            is_pregnant: z.boolean(),
            is_wet_nurse: z.boolean(),
        })
    ),

    social_status: z.object({
        status: z.nativeEnum(SOCIAL_STATUS, {
            required_error: 'الحالة الاجتماعية مطلوبة',
        }),
        number_of_wives: z.number().int().min(0),
        number_of_males: z.number().int().min(0),
        number_of_females: z.number().int().min(0),
        total_family_members: z.number().int().min(1),
        age_groups: z.record(
            z.nativeEnum(AGES),
            z.number().int().min(0)
        ),
    }),

    displacement: z.object({
        tent_number: z
            .string({ required_error: 'رقم الخيمة مطلوب' })
            .min(1, { message: 'رقم الخيمة لا يمكن أن يكون فارغًا' }),

        tent_type: z.nativeEnum(ACCOMMODATION_TYPE, {
            required_error: 'نوع الخيمة مطلوب',
        }),

        family_status_type: z.nativeEnum(FAMILY_STATUS_TYPE, {
            required_error: 'حالة الأسرة مطلوبة',
        }),

        displacement_date: z
            .string({ required_error: 'تاريخ النزوح مطلوب' })
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'تاريخ النزوح غير صالح',
            }),

        delegate: z.object({
            id: z.string(),
            name: z.string(),
        }),
    }),

    war_injuries: z.array(
        z.object({
            name: z.string({ required_error: 'اسم المصاب مطلوب' }),
            injury: z.string({ required_error: 'وصف الإصابة مطلوب' }),
        })
    ),

    martyrs: z.array(
        z.object({
            name: z.string({ required_error: 'اسم الشهيد مطلوب' }),
        })
    ),

    medical_conditions: z.array(
        z.object({
            name: z.string({ required_error: 'اسم المريض مطلوب' }),
            condition: z.string({ required_error: 'نوع الحالة الطبية مطلوب' }),
        })
    ),

    additional_notes: z.string().optional().nullable(),
});

export type DisplacedProfileSchemaType = z.infer<typeof displacedProfileSchema>;
