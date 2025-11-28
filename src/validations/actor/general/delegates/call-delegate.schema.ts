import z from "zod";
import dayjs from 'dayjs';

export const callDelegateFormSchema = z.object({
    dateTime: z.date().refine((date) => dayjs(date).isAfter(dayjs()), {
        message: 'الرجاء اختيار تاريخ ووقت في المستقبل',
    }),
    details: z.string().min(1, 'الرجاء إدخال تفاصيل الاستدعاء'),
});

export type TCallDelegateFormValues = z.infer<typeof callDelegateFormSchema>;



