'use client';

import {
  Box,
  Group,
  LoadingOverlay,
  Paper,
  Center,
  ThemeIcon,
  Text,
  Stack,
  Divider,
  Image,
} from '@mantine/core';
import { StaticImageData } from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MessageCircleWarning } from 'lucide-react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { getArticle } from '@/actions/landing/blog/getArticle';
import { IArticleResponse } from '@/types/landing/blog/blog.type';

interface IArticleContentProps {
  articleId: number;
}

export default function ArticleContent({ articleId }: IArticleContentProps) {
  const {
    data: ArticleData,
    isLoading,
    error,
  } = useQuery<IArticleResponse, Error>({
    queryKey: ['article', articleId],
    queryFn: () =>
      getArticle({
        id: articleId,
      }),
  });

  const hasError = Boolean(error) || Boolean(ArticleData?.error);
  const data = ArticleData?.article;
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <Stack pos='relative' px={{ base: 16, md: 40 }} py={20} w='100%'>
      <LoadingOverlay visible={isLoading} zIndex={1000} />

      {hasError ? (
        <Paper p='md' withBorder className='bg-red-100! rounded-md'>
          <Center mb='sm'>
            <ThemeIcon color='red' variant='light' size='lg'>
              <MessageCircleWarning />
            </ThemeIcon>
          </Center>
          <Text c='red' fw={600} ta='center'>
            {ArticleData?.error || error?.message || 'حدث خطأ أثناء جلب المحتوى'}
          </Text>
        </Paper>
      ) : (
        <Stack gap='xl' w='100%'>
          <Group justify='space-between' align='center' w='100%'>
            <Text fw={600} fz={20} className='text-gray-900'>
              {data?.title}
            </Text>
            <Text size='sm' c='dimmed'>
              نُشر بتاريخ:
              {data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString('ar-EG')
                : 'تاريخ غير متوفر'}
            </Text>
          </Group>

          {data && data.imgs.length > 0 && (
            <Box w='100%' className='rounded overflow-hidden'>
              <Carousel
                slideSize='100%'
                withControls
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                emblaOptions={{ loop: true }}
                classNames={{
                  controls: '!text-black !bg-transparent !px-10 !hidden md:!flex',
                  control: '!bg-gray-100',
                }}
                styles={{ root: { width: '100%' } }}
              >
                {data.imgs.map((img, index) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={
                        typeof img === 'object' && img !== null && 'src' in img
                          ? (img as StaticImageData).src
                          : (img as string)
                      }
                      alt={data.title}
                      radius='md'
                      className='mx-auto rounded w-full max-h-[250px] object-cover!'
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Box>
          )}

          <Divider my={8} />

          <Box
            dir='rtl'
            className='w-full max-w-none *:max-w-full prose prose-lg prose-slate'
            dangerouslySetInnerHTML={{ __html: data?.content || '' }}
          />
        </Stack>
      )}
    </Stack>
  );
}
