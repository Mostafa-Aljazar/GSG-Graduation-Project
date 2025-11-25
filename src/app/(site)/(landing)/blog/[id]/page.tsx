import ArticleContent from '@/components/landing/article/article-content';
import { Stack } from '@mantine/core';

interface IArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: IArticlePageProps) {
  const { id } = await params;

  return (
    <Stack pt={60} className='w-full' mih='100vh'>
      <ArticleContent articleId={parseInt(id)} />
    </Stack>
  );
}
