'use client';

import { Card, Flex, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { cn } from '@/utils/cn';
import { useDisclosure } from '@mantine/hooks';
import { CalendarClock, CircleCheck } from 'lucide-react';
import { IDisplacedReceivedAid } from '@/types/actor/displaced/received-aids/displacedReceivedAidsResponse.type';
import { DISPLACED_RECEIVED_AIDS_TABS } from '@/types/actor/common/index.type';
import DisplacedViewReceivedAidModal from './displaced-view-received-aid-modal';

interface IDisplacedReceivedAidCardProps {
  receivedAid: IDisplacedReceivedAid;
}

export default function DisplacedReceivedAidCard({ receivedAid }: IDisplacedReceivedAidCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const isReceived = receivedAid.tabType === DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS;

  return (
    <>
      <Card
        radius='md'
        shadow='xs'
        onClick={open}
        className={cn(
          'hover:shadow-md transition-all duration-150 cursor-pointer',
          isReceived ? 'bg-blue-50!' : 'bg-red-50!'
        )}
      >
        <Group align='center' gap='sm' wrap='nowrap'>
          <ThemeIcon size='lg' radius='xl' variant='light' color={isReceived ? 'blue' : 'red'}>
            {isReceived ? <CircleCheck size={20} /> : <CalendarClock size={20} />}
          </ThemeIcon>

          <Stack gap={4} w='100%'>
            <Flex
              direction={{ base: 'column', sm: 'row-reverse' }}
              justify='space-between'
              align={{ sm: 'center' }}
              gap='xs'
            >
              <Text fz='xs' c='dimmed'>
                {new Date(receivedAid.deliveryDate).toLocaleDateString()}
              </Text>
              <Text fw={600} fz='sm' c='dark' className='truncate'>
                {isReceived ? 'لقد استلمت' : 'لديك استلام'} {receivedAid.aidName}
              </Text>
            </Flex>

            <Text fz='xs' c='gray.7' lineClamp={1}>
              {receivedAid.aidContent}
            </Text>
          </Stack>
        </Group>
      </Card>

      <DisplacedViewReceivedAidModal receivedAid={receivedAid} opened={opened} close={close} />
    </>
  );
}
