import { z } from "zod";
import {
    DISTRIBUTION_MECHANISM,
    QUANTITY_AVAILABILITY,
    TYPE_AIDS,
    TYPE_GROUP_AIDS,
} from "@/types/actor/common/index.type";

// =======================
// Shared Schemas
// =======================

export const categoryRangeSchema = z.object({
    id: z.string({ error: "المعرف مطلوب" }),
    label: z.string({ error: "الاسم مطلوب" }),
    min: z
        .number({ error: "القيمة الدنيا مطلوبة" })
        .int("يجب أن يكون رقم صحيح")
        .nonnegative("يجب أن يكون الرقم صفر أو أكثر"),
    max: z
        .number()
        .int("يجب أن يكون رقم صحيح")
        .nonnegative("يجب أن يكون الرقم صفر أو أكثر")
        .nullable(),
    isDefault: z.boolean().optional(),
    portion: z.number().optional(),
});

export type TCategoryRangeFormValues = z.infer<typeof categoryRangeSchema>;


export const delegatePortionSchema = z.object({
    delegateId: z
        .number({ error: "المندوب مطلوب" })
        .int("يجب أن يكون رقم صحيح")
        .positive("يجب أن يكون أكبر من صفر"),
    portion: z
        .number({ error: "الحصة مطلوبة" })
        .positive("يجب أن يكون أكبر من صفر"),
});

export const receivedDisplacedSchema = z.object({
    displacedId: z
        .number({ error: "المستفيد مطلوب" })
        .int("يجب أن يكون رقم صحيح")
        .positive("يجب أن يكون أكبر من صفر"),
    receivedTime: z.coerce.date({
        error: "صيغة التاريخ غير صحيحة",
    }),
});

// =======================
// Base Aid Schema
// =======================

export const baseAidFormSchema = z.object({
    aidName: z
        .string({ error: "اسم المساعدة مطلوب" })
        .min(1, "اسم المساعدة مطلوب"),

    aidType: z.enum(TYPE_AIDS, {
        error: "نوع المساعدة مطلوب",
    }),

    aidContent: z
        .string({ error: "محتوى المساعدة مطلوب" })
        .min(1, "محتوى المساعدة مطلوب"),

    deliveryDate: z
        .coerce
        .date({ error: "صيغة التاريخ غير صحيحة" })
        .nullable(),

    deliveryLocation: z
        .string({ error: "موقع التسليم مطلوب" })
        .min(1, "موقع التسليم مطلوب"),

    securityRequired: z.boolean({
        error: "خيار التأمين مطلوب",
    }),

    quantityAvailability: z.enum(QUANTITY_AVAILABILITY, {
        error: "حالة توفر الكمية مطلوبة",
    }),

    existingQuantity: z
        .number()
        .int("يجب أن يكون رقم صحيح")
        .nonnegative("يجب أن يكون الرقم صفر أو أكثر")
        .optional(),

    selectedCategories: z
        .array(categoryRangeSchema, {
            error: "يجب اختيار فئة واحدة على الأقل",
        })
        .min(1, "يجب اختيار فئة واحدة على الأقل"),

    additionalNotes: z.string().optional(),

    distributionMechanism: z.enum(DISTRIBUTION_MECHANISM, {
        error: "آلية التوزيع مطلوبة",
    }),
});

export const addEditAidFormSchema = baseAidFormSchema;
export type TAddEditAidFormValues = z.infer<typeof addEditAidFormSchema>;

// =======================
// Final Aid Entity (DB)
// =======================

export const aidEntityFormSchema = baseAidFormSchema.extend({
    id: z
        .number({ error: "المعرف مطلوب" })
        .int("يجب أن يكون رقم صحيح")
        .positive("يجب أن يكون أكبر من صفر"),

    selectedDisplacedIds: z.array(
        z
            .number({ error: "المعرف مطلوب" })
            .int("يجب أن يكون رقم صحيح")
            .positive("يجب أن يكون أكبر من صفر")
    ),

    selectedDelegatesPortions: z.array(delegatePortionSchema).optional(),

    receivedDisplaceds: z.array(receivedDisplacedSchema, {
        error: "المستلمون مطلوبون",
    }),

    securitiesId: z
        .array(
            z
                .number()
                .int("يجب أن يكون رقم صحيح")
                .positive("يجب أن يكون أكبر من صفر")
        )
        .optional(),

    isCompleted: z.boolean({
        error: "حالة الإكمال مطلوبة",
    }),

    aidStatus: z.enum(TYPE_GROUP_AIDS, {
        error: "حالة المساعدة مطلوبة",
    }),
});

export type TAidFormValues = z.infer<typeof aidEntityFormSchema>;
