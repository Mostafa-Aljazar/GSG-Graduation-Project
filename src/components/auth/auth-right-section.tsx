import { MoveLeft, Home } from 'lucide-react';
import { Group, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { LANDING_ROUTES } from '@/constants/routes';

export default function AuthRightSection() {
  return (
    <Stack align='center' justify='center' h={{ base: '100%', lg: '100vh' }} gap={26} px={12}>
      <Text c='white' fw={700} fz={{ base: 28, md: 36 }} lh={1.25} ta='center'>
        مرحباً بك في مخيم الأقصى
        <br />
        لإيواء النازحين 👋
      </Text>

      <Group
        justify='space-between'
        align='center'
        px={20}
        py={12}
        w='100%'
        h={{ base: 50, lg: 46 }}
        c='white'
        className='bg-white/8! hover:bg-white/14! shadow-[0_4px_12px_rgba(0,0,0,0.15)]! backdrop-blur-md! border-white/25! hover:border-white/40! rounded-xl! transition-all! duration-200! cursor-pointer!'
      >
        <Text fw={600} fz={{ base: 15, md: 17 }}>
          استكشف المساعدات أو قم بإدارة الخدمات
        </Text>
        <MoveLeft strokeWidth={1.4} />
      </Group>

      <Link href={LANDING_ROUTES.HOME} style={{ width: '100%' }}>
        <Group
          justify='space-between'
          align='center'
          px={20}
          py={12}
          w='100%'
          h={{ base: 50, lg: 46 }}
          c='white'
          className='bg-white/8! hover:bg-white/14! shadow-[0_4px_12px_rgba(0,0,0,0.15)]! backdrop-blur-md! border-white/25! hover:border-white/40! rounded-xl! transition-all! duration-200! cursor-pointer!'
        >
          <Text fw={600} fz={{ base: 15, md: 17 }}>
            العودة إلى الصفحة الرئيسية
          </Text>
          <Home strokeWidth={1.4} />
        </Group>
      </Link>
    </Stack>
  );
}
