import MantineLayout from '@/components/common/layouts/mantine-layout';
import { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <MantineLayout>{children}</MantineLayout>;
}
