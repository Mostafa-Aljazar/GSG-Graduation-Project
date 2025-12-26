'use client';

import { Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { MessageCircleWarning } from 'lucide-react';
import { BLOG_TITLE, SUCCESS_STORIES_TITLE } from '@/content/landing';
import { IWrittenContentsResponse } from '@/types/common/written-content/written-content-response.type';
import { getWrittenContents } from '@/actions/common/written-content/getWrittenContents';
import WrittenContentList from './written-content-list';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';

interface IOurBlogOrStoriesProps {
  destination: TYPE_WRITTEN_CONTENT;
}

export default function OurWrittenContent({ destination }: IOurBlogOrStoriesProps) {
  const [activePage] = useQueryState('page', parseAsInteger.withDefault(1));
  const limit = 5;

  const {
    data: writtenContentData,
    isLoading,
    error,
  } = useQuery<IWrittenContentsResponse>({
    queryKey: ['WrittenContents', activePage],
    queryFn: () =>
      getWrittenContents({
        page: activePage,
        limit,
        type: destination,
      }),
  });

  const hasError = Boolean(error) || Boolean(writtenContentData?.error);

  const title = destination == TYPE_WRITTEN_CONTENT.BLOG ? BLOG_TITLE : SUCCESS_STORIES_TITLE;

  const ErrorSection = hasError && (
    <Paper
      w={{ base: '95%', sm: '80%', md: '60%' }}
      p={{ base: 'xl', md: '2xl' }}
      radius='xl'
      shadow='md'
      withBorder
      className='bg-[--color-second-light] mx-auto border-[--color-second]/30 text-center'
    >
      <Stack align='center' gap='lg'>
        <ThemeIcon size={50} radius='xl' variant='light' className='bg-red-200/20! text-red-500!'>
          <MessageCircleWarning size={25} strokeWidth={1.8} />
        </ThemeIcon>

        <Text fz={{ base: 16, md: 20 }} fw={500} className='text-red-500!'>
          حدث خطأ أثناء تحميل المحتوى
        </Text>

        <Text fz={{ base: 14, md: 16 }} c='gray.7' maw={500} className='leading-relaxed'>
          {writtenContentData?.error ||
            error?.message ||
            'تعذر جلب المحتوى في الوقت الحالي. قد يكون ذلك بسبب مشكلة في الاتصال أو صيانة مؤقتة.'}
        </Text>

        <Text fz='md' c='gray.6' className='font-medium'>
          يرجى المحاولة مرة أخرى لاحقًا، أو تحديث الصفحة.
        </Text>
      </Stack>
    </Paper>
  );

  return (
    <Stack py={20} gap={10}>
      <Text px={{ base: 20, md: 30 }} fw={600} fz={25} w='100%' className='text-primary!'>
        {title}
      </Text>

      {hasError ? (
        ErrorSection
      ) : (
        <WrittenContentList
          destination={destination}
          data={writtenContentData?.writtenContents ?? []}
          totalPages={writtenContentData?.pagination?.totalPages ?? 1}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );
}
