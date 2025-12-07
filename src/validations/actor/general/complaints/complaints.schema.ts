import { COMPLAINTS_STATUS } from "@/types/actor/common/index.type";
import { z } from "zod";

export const complaintFilterFormSchema = z.object({
    status: z.enum(COMPLAINTS_STATUS).nullable(),
    dateRange: z
        .tuple([z.string().nullable(), z.string().nullable()])
        .default([null, null])
        .refine(
            ([start, end]) => {
                if (start && end) {
                    return new Date(end) >= new Date(start);
                }
                return true; // If either is null, no validation needed
            },
            {
                message: 'يجب أن يكون تاريخ الانتهاء أكبر من أو يساوي تاريخ البداية',
                path: ['dateRange'], // Apply error to the dateRange field
            }
        ),


});

export type TComplaintFilterFormValues = z.infer<typeof complaintFilterFormSchema>;


