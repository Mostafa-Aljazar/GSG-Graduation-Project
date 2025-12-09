// src/hooks/useAuth.ts
'use client';

import { useEffect, useState, useTransition } from 'react';
import { USER_RANK, USER_TYPE } from '@/constants/user-types';
import { getSession } from '@/utils/auth/getSession';
import { IUser } from '@/types/actor/common/user/user.type';

interface AuthState {
  isAuthenticated: boolean;
  isManager: boolean;
  isDelegate: boolean;
  isDisplaced: boolean;
  isSecurityPerson: boolean;
  isSecurityOfficer: boolean;
  user: IUser | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isManager: false,
  isDelegate: false,
  isDisplaced: false,
  isSecurityPerson: false,
  isSecurityOfficer: false,
  user: null,
  loading: true,
};

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // This runs only on the client after mount
    const session = getSession();

    // Use startTransition to avoid the "synchronous setState in effect" warning
    startTransition(() => {
      if (!session) {
        setAuthState({
          ...initialState,
          loading: false,
        });
        return;
      }

      setAuthState({
        isAuthenticated: true,
        isManager: session.user.role === USER_TYPE.MANAGER,
        isDelegate: session.user.role === USER_TYPE.DELEGATE,
        isDisplaced: session.user.role === USER_TYPE.DISPLACED,
        isSecurityPerson: session.user.role === USER_TYPE.SECURITY_PERSON,
        isSecurityOfficer:
          session.user.role === USER_TYPE.SECURITY_PERSON &&
          session.user.rank === USER_RANK.SECURITY_OFFICER,
        user: session.user,
        loading: false,
      });
    });
  }, []); // Empty dependency → runs once on mount

  return {
    ...authState,
    loading: authState.loading || isPending, // combine both loading states
  };
}
