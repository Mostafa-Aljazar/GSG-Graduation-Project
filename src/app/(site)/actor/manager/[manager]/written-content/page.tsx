import { Suspense } from 'react';
import WrittenContentView from '@/components/actor/manager/written-content/main/content/written-content-view';

interface IWrittenContentPageProps {
  params: Promise<{ manager: string }>;
}

export default async function WrittenContentPage({ params }: IWrittenContentPageProps) {
  const { manager } = await params;
  const managerId = manager;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WrittenContentView managerId={managerId} />
    </Suspense>
  );
}
