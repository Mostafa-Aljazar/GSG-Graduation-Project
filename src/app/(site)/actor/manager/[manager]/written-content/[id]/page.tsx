import SingleWrittenContentView from '@/components/actor/manager/written-content/single-written-content/single-written-content-view';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Suspense } from 'react';

interface IProps {
  params: Promise<{ manager: string; id: string }>;
  searchParams: Promise<{ 'written-tab'?: TYPE_WRITTEN_CONTENT }>;
}

export default async function ManagerSingleWrittenContentPage({ params }: IProps) {
  const { id } = await params;
  const contentId = id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SingleWrittenContentView writtenContentId={contentId} />
    </Suspense>
  );
}
