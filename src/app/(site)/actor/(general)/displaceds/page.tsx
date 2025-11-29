import DisplacedsList from '@/components/actor/general/displaceds/view/displaceds-list';
import { Stack } from '@mantine/core';

export default function DisplacedsPage() {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <DisplacedsList />
    </Stack>
  );
}
