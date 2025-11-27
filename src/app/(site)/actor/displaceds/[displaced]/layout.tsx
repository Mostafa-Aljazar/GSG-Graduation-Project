import AlreadyUserStoreComponent from '@/components/actor/common/stores/already-user-store-component';
import { USER_TYPE } from '@/constants/user-types';
import React from 'react';

interface Props {
  params: Promise<{ displaced: string }>;
  children: React.ReactNode;
}

export default async function DisplacedLayout({ params, children }: Props) {
  const { displaced } = await params;

  return (
    <>
      <AlreadyUserStoreComponent id={displaced} userType={USER_TYPE.DISPLACED} />
      {children}
    </>
  );
}
