import { Box, Overlay, Text } from '@mantine/core';
import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

interface IChildSectionProps {
  childImage: StaticImageData;
  desc: ReactNode;
}

export default function ChildSection({ childImage, desc }: IChildSectionProps) {
  return (
    <Box pos={'relative'} w={'100%'} h={{ base: 250, md: 350 }} className='overflow-hidden!'>
      <Image
        src={childImage}
        alt='child'
        fill
        priority={true}
        className='w-full h-full object-cover'
      />
      <Overlay color='black' opacity={0.2} zIndex={0} />
      <Text
        w={'100%'}
        fw={500}
        fz={{ base: 25, md: 35 }}
        pos='absolute'
        top={'5%'}
        right={'50%'}
        ta={'center'}
        className='text-white! translate-x-1/2'
      >
        {desc}
      </Text>
    </Box>
  );
}
