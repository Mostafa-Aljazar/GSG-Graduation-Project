import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { z } from 'zod';

export const addWrittenContentFormSchema = z.object({
    type: z.enum(TYPE_WRITTEN_CONTENT, {
        error: 'يجب اختيار نوع المحتوى',
    }),
    title: z
        .string()
        .min(1, { message: 'العنوان مطلوب' })
        .max(100, { message: 'العنوان يجب ألا يتجاوز 100 حرف' }),
    brief: z
        .string()
        .max(500, { message: 'النبذة يجب ألا تتجاوز 500 حرف' })
        .optional(),
    content: z
        .string()
        .min(5, { message: 'النص مطلوب' })
        .max(10000, { message: 'النص يجب ألا يتجاوز 10000 حرف' }),
    files: z.array(z.any()).optional(), // FileWithPath type isn't strictly typed by Zod
    imageUrls: z.array(z.string()).optional(),
});

export type TAddWrittenContentFormValues = z.infer<typeof addWrittenContentFormSchema>;
