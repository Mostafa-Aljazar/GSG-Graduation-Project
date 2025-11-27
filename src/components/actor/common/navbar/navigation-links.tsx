'use client';

import { Box, Stack, Text, ThemeIcon } from '@mantine/core';
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import useAuth from '@/hooks/useAuth';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { USER_TYPE } from '@/constants/user-types';
import { getNavLinks } from '@/content/actor/common/navLinks';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
}

export default function Navigation_Links() {
  const { user, isDisplaced, isDelegate, isSecurityPerson, isSecurityOfficer, isManager } =
    useAuth();

  const pathname = usePathname();
  const userId = Number(user?.id) || 0;

  const { userId: alreadyUserId, userType: alreadyUserType } = useAlreadyUserStore();

  const navLinks: readonly NavLink[] = useMemo(() => {
    if (!user) return [];

    if (alreadyUserType == USER_TYPE.DISPLACED) {
      if (userId == alreadyUserId && isDisplaced) {
        //what appear to displaced itself
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'self' });
      } else {
        //what appear when manger or delegate or security open displaced pages
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'guest' });
      }
    }

    if (alreadyUserType == USER_TYPE.DELEGATE) {
      if (userId == alreadyUserId && isDelegate) {
        //what appear to delegate itself
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'self' });
      } else if (isManager || isSecurityPerson || isSecurityOfficer) {
        //what appear when manger or security officer open Delegate pages
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'guest' });
      } else {
        //what appear when displaced open Delegate pages
        return getNavLinks({
          userId: alreadyUserId,
          userRank: alreadyUserType,
          view: 'limited',
        });
      }
    }

    if (alreadyUserType == USER_TYPE.MANAGER) {
      if (userId == alreadyUserId && isManager) {
        //what appear to manager itself
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'self' });
      } else {
        //what appear when any user open manager pages
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'guest' });
      }
    }

    if (alreadyUserType == USER_TYPE.SECURITY_PERSON) {
      if (userId == alreadyUserId && isSecurityPerson) {
        //what appear to security person itself
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'self' });
      } else if (isManager || isSecurityOfficer) {
        //what appear when other users open security page
        return getNavLinks({ userId: alreadyUserId, userRank: alreadyUserType, view: 'guest' });
      } else {
        //what appear when other users open security page
        return getNavLinks({
          userId: alreadyUserId,
          userRank: alreadyUserType,
          view: 'limited',
        });
      }
    }

    return [];
  }, [
    user,
    isDisplaced,
    isDelegate,
    isSecurityPerson,
    isSecurityOfficer,
    isManager,
    alreadyUserId,
    alreadyUserType,
    userId,
  ]);
  console.log('🚀 ~ Navigation_Links ~ navLinks:', navLinks);

  const isLinkActive = (href: string) => {
    return href === GENERAL_ACTOR_ROUTES.SECURITIES ? pathname === href : pathname.includes(href);
  };

  return (
    <Box w='100%' className='bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden'>
      <Stack gap={0}>
        {navLinks.map((link, index) => {
          const isActive = isLinkActive(link.href);

          return (
            <Link
              key={index}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-5 py-4 transition-colors duration-200',
                'border-b border-gray-100 last:border-b-0',
                isActive
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-dark'
              )}
            >
              {link.icon && (
                <ThemeIcon
                  size={30} // حجم الإطار حول الأيقونة
                  color={isActive ? 'primary' : 'gray.2'} // استخدم ألوان الثيم حسب الحالة
                  variant={isActive ? 'filled' : 'light'}
                >
                  <link.icon size={18} />
                </ThemeIcon>
              )}
              <Text fz={15} fw={isActive ? 600 : 400} className='truncate'>
                {link.label}
              </Text>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}
