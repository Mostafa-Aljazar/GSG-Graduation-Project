import AlreadyUserStoreComponent from '@/components/actor/common/stores/already-user-store-component';
import { USER_TYPE } from '@/constants/user-types';
import React from 'react';

interface Props {
  params: Promise<{ manager: string }>;
  children: React.ReactNode;
}

export default async function ManagerLayout({ params, children }: Props) {
  const { manager } = await params;

  return (
    <>
      <AlreadyUserStoreComponent id={manager} userType={USER_TYPE.MANAGER} />
      {children}
    </>
  );
}
