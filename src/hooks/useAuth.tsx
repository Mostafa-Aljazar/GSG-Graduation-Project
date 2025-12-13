// src/hooks/useAuth.ts
'use client';

import { useEffect, useState, useTransition } from 'react';
import { USER_RANK, USER_TYPE } from '@/constants/user-types';
// import { getcookie } from '@/utils/auth/getcookie';
import { IUser } from '@/types/actor/common/user/user.type';
import { cookieClient } from '@/utils/auth/cookies/clientCookies';

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
    const cookie = cookieClient.get();

    // Use startTransition to avoid the "synchronous setState in effect" warning
    startTransition(() => {
      if (!cookie) {
        setAuthState({
          ...initialState,
          loading: false,
        });
        return;
      }

      setAuthState({
        isAuthenticated: true,
        isManager: cookie.user.role === USER_TYPE.MANAGER,
        isDelegate: cookie.user.role === USER_TYPE.DELEGATE,
        isDisplaced: cookie.user.role === USER_TYPE.DISPLACED,
        isSecurityPerson: cookie.user.role === USER_TYPE.SECURITY_PERSON,
        isSecurityOfficer:
          cookie.user.role === USER_TYPE.SECURITY_PERSON &&
          cookie.user.rank === USER_RANK.SECURITY_OFFICER,
        user: cookie.user,
        loading: false,
      });
    });
  }, []); // Empty dependency → runs once on mount

  return {
    ...authState,
    loading: authState.loading || isPending, // combine both loading states
  };
}
