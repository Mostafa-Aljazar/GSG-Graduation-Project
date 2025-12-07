import { z } from 'zod';

export const replyComplaintFormSchema = z.object({
  reply: z.string().min(3, 'الرجاء إدخال الرد'),
});

export type TReplyComplaintFormValues = z.infer<typeof replyComplaintFormSchema>;
