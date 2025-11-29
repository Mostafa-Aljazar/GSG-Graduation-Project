import z from "zod";
import dayjs from 'dayjs';

export const meetingDelegateFormSchema = z.object({
    dateTime: z.date().refine((date) => dayjs(date).isAfter(dayjs()), {
        message: 'الرجاء اختيار تاريخ ووقت في المستقبل',
    }),
    details: z.string().min(1, 'الرجاء إدخال تفاصيل الاستدعاء'),
});

export type TMeetingDelegateFormValues = z.infer<typeof meetingDelegateFormSchema>;


