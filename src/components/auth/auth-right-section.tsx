import { MoveLeft } from 'lucide-react';

import { Group, Stack, Text } from '@mantine/core';

export default function AuthRightSection() {
  return (
    <Stack align='center' justify='center' h={{ base: '100%', lg: '100vh' }}>
      <Text c='white' fw={500} fz={{ base: 30, md: 40 }} lh={1.4}>
        مرحباً بك في مخيم الأقصى <br />
        لإيواء النازحين 👋
      </Text>

      <Group
        justify='space-between'
        align='center'
        px={16}
        py={8}
        w={'100%'}
        h={{ base: 43, lg: 39 }}
        c={'white'}
        mt={{ base: 20, md: 0 }}
        wrap='nowrap'
        className='bg-transparent! border-gray-300! rounded-lg! text-nowrap! transition-colors! duration-300! border!'
      >
        <Text fw={500} fz={{ base: 14, md: 16 }}>
          استكشف المساعدات أو قم بإدارة الخدمات
        </Text>
        <MoveLeft strokeWidth={1} />
      </Group>
    </Stack>
  );
}
