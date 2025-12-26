'use client';

import CountUp from 'react-countup';
import { Box, Container, SimpleGrid, Stack, Text, ThemeIcon, Title, Card } from '@mantine/core';
import {
  HOME_STATISTICS_TITLE,
  HOME_STATISTICS_MESSAGE,
  HOME_STATISTICS_DATA,
} from '@/content/landing';

export default function Statistics() {
  return (
    <Box py={50} id='statistics' dir='rtl' className='bg-second-light'>
      <Container size='xl'>
        <Stack align='center' gap='xl'>
          <Stack align='center' gap='md' className='max-w-[900px]'>
            <Title order={2} fw={700} c={'primary.8'} fz={{ base: 20, md: 25 }} ta='center'>
              {HOME_STATISTICS_TITLE}
            </Title>
            <Text className='max-w-3xl font-medium text-dark text-lg md:text-xl text-center leading-relaxed'>
              {HOME_STATISTICS_MESSAGE}
            </Text>
          </Stack>

          <SimpleGrid
            cols={{ base: 2, md: 4 }}
            spacing={{ base: 'lg', md: 'xl' }}
            className='w-full'
          >
            {HOME_STATISTICS_DATA.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  shadow='lg'
                  p={{ base: 'xl' }}
                  radius='xl'
                  className='bg-white hover:shadow-2xl transition-all hover:-translate-y-4 duration-300'
                >
                  <Stack align='center' gap='sm'>
                    <ThemeIcon
                      size={60}
                      radius='xl'
                      variant='filled'
                      className='bg-second text-white'
                    >
                      <Icon size={30} strokeWidth={1.8} />
                    </ThemeIcon>

                    <Text className='font-black text-second text-4xl md:text-5xl text-center'>
                      <CountUp
                        end={stat.value}
                        duration={2.8}
                        enableScrollSpy
                        scrollSpyDelay={200}
                        formattingFn={(value) =>
                          value >= 1000
                            ? `+${(value / 1000).toFixed(1).replace('.0', '')} ألف`
                            : `+${value}`
                        }
                      />
                    </Text>

                    <Text className='font-semibold text-dark text-lg text-center'>
                      {stat.label}
                    </Text>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
