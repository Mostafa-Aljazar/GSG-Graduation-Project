import { TYPE_AIDS } from '@/types/actor/common/index.type';
import { z } from 'zod';

export const aidsManagementFilterFormSchema = z.object({
    type: z.nativeEnum(TYPE_AIDS).nullable(),

    dateRange: z.preprocess((val) => {
        if (!val) return [null, null];
        const [start, end] = val as (Date | string | null)[];
        return [
            start instanceof Date ? start : start ? new Date(start) : null,
            end instanceof Date ? end : end ? new Date(end) : null,
        ];
    }, z
        .tuple([z.date().nullable(), z.date().nullable()])
        .refine(([start, end]) => !start || !end || end >= start, {
            message: 'يجب أن يكون تاريخ الانتهاء أكبر من أو يساوي تاريخ البداية',
            path: ['dateRange'],
        })
    ),

    recipientsRange: z.preprocess((val) => {
        if (!val) return [null, null];
        const [from, to] = val as (number | string | null)[];
        return [
            typeof from === 'number' ? from : from ? parseInt(from, 10) : null,
            typeof to === 'number' ? to : to ? parseInt(to, 10) : null,
        ];
    }, z
        .tuple([z.number().nullable(), z.number().nullable()])
        .refine(([from, to]) => from === null || to === null || to >= from, {
            message: 'يجب أن يكون الحد الأقصى أكبر من أو يساوي الحد الأدنى',
            path: ['recipientsRange.1'],
        })
    ),
});

export type TAidsManagementFilterFormValues = z.infer<typeof aidsManagementFilterFormSchema>;
