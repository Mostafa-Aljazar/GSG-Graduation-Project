import AlreadyUserStoreComponent from '@/components/actor/common/stores/already-user-store-component';
import { USER_TYPE } from '@/constants/user-types';
import React from 'react';

interface Props {
  params: Promise<{ security: string }>;
  children: React.ReactNode;
}

export default async function SecuritiesLayout({ params, children }: Props) {
  const { security } = await params;

  return (
    <>
      <AlreadyUserStoreComponent id={security} userType={USER_TYPE.SECURITY_PERSON} />
      {children}
    </>
  );
}
