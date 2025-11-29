import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type';
import { Box, Card, Stack, Text, Group, ThemeIcon } from '@mantine/core';
import { Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AdCardProps {
  ad: IWrittenContent;
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <Link href={`${GENERAL_ACTOR_ROUTES.ADS}/${ad.id}`}>
      <Card
        p={0}
        withBorder
        radius='md'
        shadow='sm'
        className='flex flex-col hover:shadow-md h-full hover:scale-[1.02] transition-transform duration-200 ease-in-out'
      >
        <Box className='relative'>
          <Image
            src={ad.imgs[0]}
            alt={ad.title}
            width={500}
            height={300}
            className='rounded-t-md w-full h-40 object-cover'
          />
        </Box>

        <Stack p='sm' gap={6} className='flex-1'>
          <Text fw={600} fz={14} lineClamp={1}>
            {ad.title}
          </Text>

          <Group gap={6} align='flex-start' wrap='nowrap' className='flex-1'>
            <ThemeIcon size='sm' variant='light' color='blue'>
              <Info size={14} />
            </ThemeIcon>
            <Text fw={400} fz={14} c='dimmed' lineClamp={3}>
              {ad.brief || 'لا يوجد وصف'}
            </Text>
          </Group>
        </Stack>
      </Card>
    </Link>
  );
}
