import { Stack } from '@mantine/core';
import DisplacedReceivedAidHeaderTabs from '@/components/actor/displaced/received-aids/displaced-received-aids-tabs';
import { Suspense } from 'react';
import DisplacedReceivedAidsFeed from '@/components/actor/displaced/received-aids/displaced-recived-aids-feed';

interface IDisplacedReceivedAidPageProps {
  params: Promise<{ displaced: string }>;
}

export default async function DisplacedReceivedAidPage({ params }: IDisplacedReceivedAidPageProps) {
  const { displaced } = await params;
  const displacedId = Number(displaced);

  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'} px={10}>
      <DisplacedReceivedAidHeaderTabs />

      <Suspense fallback={<div>Loading...</div>}>
        <DisplacedReceivedAidsFeed displacedId={displacedId} />
      </Suspense>
    </Stack>
  );
}
