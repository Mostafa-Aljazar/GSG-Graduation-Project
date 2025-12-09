'use client';

import { Box, Button, Flex, Group, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import { CalendarDays, ChevronRight, Tag, TextQuote } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type';
import WrittenContentCardAction from './written-content-card-action';
import { useRouter } from 'next/navigation';
import { getManagerRoutes } from '@/constants/routes';

interface IWrittenContentCardProps {
  writtenData: IWrittenContent;
  managerId: string;
}

export default function WrittenContentCard({ writtenData, managerId }: IWrittenContentCardProps) {
  const { user, isManager } = useAuth();
  const isOwner = managerId == user?.id && isManager;
  const router = useRouter();

  const handleCardClick = () => {
    router.push(
      getManagerRoutes({
        managerId,
        writtenContent: { id: writtenData.id, type: writtenData.type },
      }).WRITTEN_CONTENT
    );
  };

  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align='stretch'
      className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-md overflow-hidden transition-all'
    >
      <Box pos='relative' w={{ base: '100%', sm: 180 }} h={{ base: 120, sm: 130 }}>
        {writtenData.imgs?.[0] ? (
          <Image alt='Blog Image' src={writtenData.imgs[0]} fill className='object-cover' />
        ) : (
          <Box w='100%' h='100%' bg='gray.2' />
        )}
      </Box>

      <Stack flex={1} justify='space-between' py={10} px={{ base: 12, sm: 16 }} gap={8}>
        <Group justify='space-between'>
          <Group gap={6} align='center'>
            <CalendarDays size={14} strokeWidth={1.5} className='text-gray-500' />
            <Text fz={11} c='dimmed'>
              {writtenData.createdAt && new Date(writtenData.createdAt).toLocaleDateString()}
            </Text>
          </Group>

          {isOwner && (
            <WrittenContentCardAction
              writtenContentId={writtenData.id}
              type={writtenData.type}
              managerId={managerId}
            />
          )}
        </Group>

        <Stack gap={6}>
          <Group gap={6} align='center'>
            <Tag size={14} strokeWidth={1.5} className='mt-1 text-primary' />
            <Text fw={600} fz={{ base: 14, sm: 16 }} className='text-primary! line-clamp-1'>
              {writtenData.title}
            </Text>
          </Group>

          <Group gap={6} align='start'>
            <TextQuote size={16} strokeWidth={1.5} className='mt-1 text-gray-600' />
            <Text fw={400} fz={12} className='text-dark! line-clamp-2'>
              {writtenData.brief}
            </Text>
          </Group>
        </Stack>

        <Button
          variant='subtle'
          size='xs'
          h={26}
          px={8}
          className='self-end!'
          rightSection={<ChevronRight size={14} />}
          onClick={handleCardClick}
        >
          المزيد
        </Button>
      </Stack>
    </Flex>
  );
}
