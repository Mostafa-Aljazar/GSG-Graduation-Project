import { z } from 'zod';

export const searchDisplacedSchema = z.object({
    search: z.string().min(1, 'يرجى إدخال كلمة للبحث'),
});

export type TSearchDisplacedFormValues = z.infer<typeof searchDisplacedSchema>;
