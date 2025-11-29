import AlreadyUserStoreComponent from '@/components/actor/common/stores/already-user-store-component';
import { USER_TYPE } from '@/constants/user-types';
import React from 'react';

interface Props {
  params: Promise<{ delegate: string }>;
  children: React.ReactNode;
}

export default async function DelegateLayout({ params, children }: Props) {
  const { delegate } = await params;

  return (
    <>
      <AlreadyUserStoreComponent id={delegate} userType={USER_TYPE.DELEGATE} />
      {children}
    </>
  );
}
