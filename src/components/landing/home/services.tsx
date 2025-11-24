import Image from 'next/image'; // Assuming Next.js Image component
import { Box, Flex, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { HOME_SERVICES_Data, HOME_SERVICES_TITLE } from '@/content/landing';
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
      <Text fw={600} c={'primary.8'} fz={{ base: 20, md: 25 }} ta={'center'} w={'100%'}>
        {HOME_SERVICES_TITLE}
      </Text>
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
              gap='sm'
              align='center'
              bg={'white'}
              p={10}
              w={{ base: '100%', md: '100%' }}
              className='shadow-md! mx-auto rounded-sm transition-all! duration-300! ease-in-out!'
            >
              <ThemeIcon variant='transparent' className='text-primary!'>
                <stat.icon size={25} />
              </ThemeIcon>
              <Stack gap={0} justify='center' align='center'>
                <Text ta={'center'} fw={600} fz={16} className='text-primary!'>
                  {stat.title}
                </Text>
                <Text ta={'center'} fw={500} fz={15} className='text-dark'>
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
