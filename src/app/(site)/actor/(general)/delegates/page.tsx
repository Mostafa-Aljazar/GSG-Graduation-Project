import DelegatesList from '@/components/actor/general/delegates/view/delegates-list';
import { Stack } from '@mantine/core';

export default function DelegatesPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <DelegatesList />
    </Stack>
  );
}
