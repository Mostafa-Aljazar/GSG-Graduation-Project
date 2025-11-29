import { ACCOMMODATION_TYPE, AGES, CHRONIC_DISEASE, FAMILY_STATUS_TYPE, WIFE_STATUS } from '@/types/actor/common/index.type';
import { z } from 'zod';

export const displacedsFilterFormSchema = z.object({
    wifeStatus: z.enum(WIFE_STATUS).nullable(),
    familyNumber: z.number().nullable(),
    ages: z.array(z.enum(AGES)).nullable(),
    chronicDisease: z.enum(CHRONIC_DISEASE).nullable(),
    accommodationType: z.enum(ACCOMMODATION_TYPE).nullable(),
    familyStatusType: z.enum(FAMILY_STATUS_TYPE).nullable(),
    delegate: z.array(z.string()).nullable(),
});

export type TDisplacedsFilterFormValues = z.infer<typeof displacedsFilterFormSchema>;

