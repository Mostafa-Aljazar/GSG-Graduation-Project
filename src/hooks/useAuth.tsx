'use client';
import { USER_RANK, USER_TYPE } from '@/constants/user-types';
import { IUser } from '@/types/auth/loginResponse.type';
import { getSession } from '@/utils/auth/getSession';
import { useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isManager: boolean;
  isDelegate: boolean;
  isDisplaced: boolean;
  isSecurityPerson: boolean;
  isSecurityOfficer: boolean;
  user: IUser | null;
}

export default function useAuth() {
  const [authState] = useState<AuthState>(() => {
    const session = getSession();
    if (!session) {
      return {
        isAuthenticated: false,
        isManager: false,
        isDelegate: false,
        isDisplaced: false,
        isSecurityPerson: false,
        isSecurityOfficer: false,
        user: null,
      };
    }

    return {
      isAuthenticated: !!session.token,
      isManager: session.user.role === USER_TYPE.MANAGER,
      isDelegate: session.user.role === USER_TYPE.DELEGATE,
      isDisplaced: session.user.role === USER_TYPE.DISPLACED,
      isSecurityPerson: session.user.role === USER_TYPE.SECURITY_PERSON,
      isSecurityOfficer:
        session.user.role === USER_TYPE.SECURITY_PERSON &&
        session.user.rank === USER_RANK.SECURITY_OFFICER,
      user: session.user,
    };
  });

  return authState;
}
