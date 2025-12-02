// src/components/common/complaints/ActorComplaintsWrapper.tsx

import CommonComplaintsContent from '../actor/general/complaints/common-complaints-content';
import { USER_RANK } from '@/constants/user-types';
import { Stack } from '@mantine/core';
import { Suspense } from 'react';

interface IActorComplaintsWrapperProps {
  actor_Id: number;
  rank: USER_RANK; 
}

// ManagerComplaints
export default function ActorComplaintsWrapper({ actor_Id, rank }: IActorComplaintsWrapperProps) {
  return (
    <Stack justify='center' align='center' pt={20} w='100%' px={10}>
      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        
        <CommonComplaintsContent actor_Id={actor_Id} rank={rank} />
      </Suspense>
    </Stack>
  );
}