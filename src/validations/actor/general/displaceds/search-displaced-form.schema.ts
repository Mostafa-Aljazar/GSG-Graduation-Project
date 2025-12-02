import { z } from 'zod';

export const searchDisplacedSchema = z.object({
    search: z.string().min(1, 'يرجى إدخال كلمة للبحث'),
});

export type SearchDisplacedFormValues = z.infer<typeof searchDisplacedSchema>;
