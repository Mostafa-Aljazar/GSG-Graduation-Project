import AidView from '@/components/actor/common/aids-management/aid/aid-view';
import { USER_TYPE } from '@/constants/user-types';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ manager: string; aid: string }>;
}

export default async function AidPage({ params }: Props) {
  const { manager, aid } = await params;
  const managerId = manager;
  const aidId = aid;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AidView actorId={managerId} role={USER_TYPE.MANAGER} aidId={aidId} />
    </Suspense>
  );
}
