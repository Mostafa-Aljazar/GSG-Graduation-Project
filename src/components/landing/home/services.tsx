import Image from 'next/image'; // Assuming Next.js Image component
import { Box, Flex, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { HOME_SERVICES_Data, HOME_SERVICES_SUBTITLE, HOME_SERVICES_TITLE } from '@/content/landing';
import { IMG_SERVICES_TENT } from '@/assets/landing/home';

export default function Services() {
  return (
    <Flex
      direction={'column'}
      id='our-service'
      align='center'
      px={{ base: '5%', xl: '10%' }}
      py={30}
      gap={{ base: 0, md: 20 }}
    >
      <Stack align='center' gap='sm'>
        <Title order={2} fw={700} c={'primary.8'} fz={{ base: 20, md: 25 }} ta='center'>
          {HOME_SERVICES_TITLE}
        </Title>
        <Text ta='center' c='dimmed' maw={720}>
          {HOME_SERVICES_SUBTITLE}
        </Text>
      </Stack>

      <Flex
        p={0}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'center', md: 'start' }}
        gap={20}
        w={'100%'}
      >
        <Box w={{ base: 300, md: 700, lg: 700 }}>
          <Image src={IMG_SERVICES_TENT} alt='Camp scene' className='object-fill!' />
        </Box>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={20} w={'100%'}>
          {HOME_SERVICES_Data.map((stat, index) => (
            <Stack
              key={index}
              gap={10}
              align='center'
              bg={'white'}
              p={20}
              w={{ base: '100%', md: '100%' }}
              className='bg-white hover:shadow-md border border-gray-100 rounded-lg transition-all hover:-translate-y-4 duration-300'
            >
              <ThemeIcon variant='transparent' className='text-primary/80!'>
                <stat.icon size={25} />
              </ThemeIcon>
              <Stack gap={10} justify='center' align='center'>
                <Text ta={'center'} fw={500} fz={16} className='text-primary/80!'>
                  {stat.title}
                </Text>
                <Text ta={'center'} fw={400} fz={14} c={'gray'} className='text-dark'>
                  {stat.description}
                </Text>
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
