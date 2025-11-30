import { TASKS_TABS } from "@/types/actor/common/index.type";
import z from "zod";

export const saveTaskFormSchema = z.object({
    title: z.string().min(3, 'العنوان قصير جدًا'),
    body: z.string().min(10, 'المحتوى قصير جدًا'),
    dateTime: z.date({ error: 'التاريخ والوقت مطلوبان' }),
    securitiesIds: z.array(z.string()),
    type: z.enum(TASKS_TABS),
});

export type TSaveTaskFormValues = z.infer<typeof saveTaskFormSchema>;