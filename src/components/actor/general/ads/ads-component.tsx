import { Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { Megaphone } from 'lucide-react';
import { Suspense } from 'react';
import AdsContent from './ads-content';

function AdsHeader() {
  return (
    <Group gap={8}>
      <ThemeIcon color='green' radius={'100%'} variant='light' size='lg'>
        <Megaphone size={16} className='text-primary!' />
      </ThemeIcon>
      <Text fw={600} fz={{ base: 16, md: 20 }} className='text-primary!'>
        الإعلانات :
      </Text>
    </Group>
  );
}

export default function AdsView() {
  return (
    <Stack py={20} gap={10} w={'100%'} px={10}>
      <AdsHeader />

      <Suspense fallback={<div>Loading...</div>}>
        <AdsContent />
      </Suspense>
    </Stack>
  );
}
