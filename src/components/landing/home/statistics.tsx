'use client';
import CountUp from 'react-countup';
import {
  HOME_STATISTICS_MESSAGE,
  HOME_STATISTICS_DATA,
  HOME_STATISTICS_TITLE,
} from '@/content/landing';
import { Group, Stack, Text, SimpleGrid, ThemeIcon } from '@mantine/core';

export default function Statistics() {
  return (
    <Stack bg={'#F7F2DB'} align='center' px={{ base: '5%', xl: '10%' }} py={30} gap={20}>
      <Text fw={600} c={'primary.8'} fz={{ base: 20, md: 25 }} ta={'center'} w={'100%'}>
        {HOME_STATISTICS_TITLE}
      </Text>
      <Stack justify='center' gap='lg'>
        <Text fz={{ base: 16, md: 20 }} fw={500} c={'dark'} ta='center'>
          {HOME_STATISTICS_MESSAGE}
        </Text>

        <SimpleGrid cols={2} spacing='lg' w={'100%'} mx={'auto'}>
          {HOME_STATISTICS_DATA.map((stat, index) => (
            <Group
              key={index}
              gap='sm'
              wrap='nowrap'
              align='center'
              p={20}
              className='justify-center!'
            >
              <ThemeIcon variant='transparent' className='text-primary!'>
                <stat.icon size={30} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text fw={600} fz='lg' className='text-primary!'>
                  <CountUp
                    start={0}
                    end={typeof stat.value === 'number' ? stat.value : 0}
                    duration={1.5}
                    // redraw={true}
                    enableScrollSpy
                    formattingFn={(val) =>
                      val >= 1000 ? `+${(val / 1000).toFixed(1)} K` : `+${val}`
                    }
                  >
                    {({ countUpRef }) => <span ref={countUpRef} />}
                  </CountUp>
                </Text>
                <Text fz='lg' className='text-primary!'>
                  {stat.label}
                </Text>
              </Stack>
            </Group>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
