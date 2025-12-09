import { Suspense } from 'react';
import SingleWrittenContentView from '@/components/actor/manager/written-content/single-written-content/single-written-content-view';
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';

interface IAdPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdPage({ params }: IAdPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SingleWrittenContentView writtenContentId={id} destination={TYPE_WRITTEN_CONTENT.ADS} />
    </Suspense>
  );
}
