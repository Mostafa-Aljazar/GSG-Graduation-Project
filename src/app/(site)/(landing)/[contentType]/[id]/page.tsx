import SingleWrittenContentComponent from '@/components/landing/written-content/single-written-content/single-written-content-component';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Stack } from '@mantine/core';

interface IArticlePageProps {
  params: Promise<{ id: string; contentType: TYPE_WRITTEN_CONTENT }>;
}

export default async function SingleWrittenContentPage({ params }: IArticlePageProps) {
  const { id, contentType } = await params;

  return (
    <Stack pt={60} className='w-full' mih='100vh'>
      <SingleWrittenContentComponent contentId={id} contentType={contentType} />
    </Stack>
  );
}
