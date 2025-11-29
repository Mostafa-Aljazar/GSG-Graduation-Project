import SecuritiesList from '@/components/actor/general/securities/view/securities-list';
import { Stack } from '@mantine/core';

export default function SecuritiesPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <SecuritiesList />
    </Stack>
  );
}
