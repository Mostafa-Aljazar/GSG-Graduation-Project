'use client';

import { Stack } from '@mantine/core';
import AidAddDisplacedsFilters from './common-aid-add-displaceds-filters';
import { DisplacedsProvider } from '@/components/actor/general/displaceds/context/displaceds-context';
import AidAddDisplacedsTable from './common-aid-add-displaceds-table';
import { AidStep } from '../../add/add-aid-editor';

interface ICommonAidAddDisplacedsProps {
  handelActiveStep: ({ step }: { step: AidStep }) => void;
  handleSubmit: () => void; // added
}

export default function CommonAidAddDisplaceds({
  handelActiveStep,
  handleSubmit,
}: ICommonAidAddDisplacedsProps) {
  return (
    <Stack>
      <DisplacedsProvider>
        <AidAddDisplacedsFilters />
        <AidAddDisplacedsTable handelActiveStep={handelActiveStep} handleSubmit={handleSubmit} />
      </DisplacedsProvider>
    </Stack>
  );
}
