'use client';
import { LANDING_ROUTES } from '@/constants/routes';
import { NAVBAR_LINKS } from '@/content/common/header';
import { cn } from '@/utils/cn';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderLinks() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      const newHash = window.location.hash;
      setCurrentHash(newHash);
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (pathname !== LANDING_ROUTES.HOME || !window.location.hash) {
        setCurrentHash('');
      }
    });
  }, [pathname]);

  const isLinkActive = (link: string) => {
    const isAnchorLink = link.startsWith('/#') || link.startsWith('#');
    const linkHash = isAnchorLink ? link.replace('/', '') : '';

    // Anchor link match
    if (isAnchorLink) {
      return pathname === LANDING_ROUTES.HOME && currentHash === linkHash;
    }

    // Home active only if no hash
    if (link === LANDING_ROUTES.HOME) {
      return pathname === LANDING_ROUTES.HOME && !currentHash;
    }

    // Blog match
    if (link === LANDING_ROUTES.BLOG) {
      return pathname.startsWith('/blog') && !currentHash;
    }

    // Success-Stories match
    if (link === LANDING_ROUTES.SUCCESS_STORY) {
      return pathname.startsWith('/success-stories') && !currentHash;
    }

    return pathname === link;
  };

  const handleLinkClick = (link: string) => {
    if (link.startsWith('/#')) {
      const hash = link.slice(1);
      setCurrentHash(hash);
    } else {
      setCurrentHash('');
    }
  };

  return (
    <>
      {NAVBAR_LINKS.map((item, index) => (
        <Link href={item?.link || ''} key={index} onClick={() => handleLinkClick(item?.link || '')}>
          <Text
            fz={18}
            className={cn(
              'font-medium text-primary!',
              isLinkActive(item?.link || '') && 'font-bold!'
            )}
          >
            {item?.label || ''}
          </Text>
        </Link>
      ))}
    </>
  );
}
