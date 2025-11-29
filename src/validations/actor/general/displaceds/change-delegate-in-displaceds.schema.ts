import z from "zod";

export const changeDelegateFormSchema = z.object({
    delegateId: z.string().min(1, 'الرجاء اختيار مندوب'),

});

export type TChangeDelegateFormValues = z.infer<typeof changeDelegateFormSchema>;

