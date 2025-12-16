import AidView from '@/components/actor/common/aids-management/aid/aid-view';
import { USER_TYPE } from '@/constants/user-types';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ delegate: string; aid: string }>;
}

export default async function AddDisplacedsPage({ params }: Props) {
  const { delegate, aid } = await params;
  const delegateId = delegate;
  const aidId = aid;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AidView actorId={delegateId} role={USER_TYPE.DELEGATE} aidId={aidId} />
    </Suspense>
  );
}
