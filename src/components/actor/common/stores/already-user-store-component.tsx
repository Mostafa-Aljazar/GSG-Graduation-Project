'use client';
import { useEffect } from 'react';
import { USER_TYPE } from '@/constants/user-types';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';

interface IAlreadyUserProps {
  id: string;
  userType: USER_TYPE;
}

export default function AlreadyUserStoreComponent({ id, userType }: IAlreadyUserProps) {
  const { setUser } = useAlreadyUserStore();

  useEffect(() => {
    setUser(id, userType);
  }, [id, userType, setUser]);

  return null;
}
