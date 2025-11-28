'use client';

import { getManagerRoutes } from '@/constants/routes';
import { REACT_QUERY_KEYS } from '@/types/actor/common/index.type';
import { getWrittenContentTabs, TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Button, Group, Text, ThemeIcon } from '@mantine/core';
import { SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsStringEnum, useQueryState } from 'nuqs';

interface IWrittenContentHeaderProps {
  visibleAdd: boolean;
  managerId: number;
}

export default function WrittenContentHeader({
  visibleAdd,
  managerId,
}: IWrittenContentHeaderProps) {
  const [activeTab] = useQueryState(
    REACT_QUERY_KEYS.WRITTEN_CONTENT_TAB,
    parseAsStringEnum<TYPE_WRITTEN_CONTENT>(Object.values(TYPE_WRITTEN_CONTENT)).withDefault(
      TYPE_WRITTEN_CONTENT.BLOG
    )
  );

  const router = useRouter();
  const handelAdd = () => {
    router.push(`${getManagerRoutes({ managerId }).ADD_WRITTEN_CONTENT}?written-tab=${activeTab}`);
  };

  const IconComponent = getWrittenContentTabs()[activeTab].icon;

  return (
    <Group justify='space-between' wrap='nowrap' w={'100%'}>
      <Group gap={10} wrap='nowrap' justify='center' align='center'>
        {IconComponent && (
          <ThemeIcon variant='transparent' className='text-primary! shrink-0!' size={16}>
            <IconComponent size={16} />
          </ThemeIcon>
        )}
        <Text fw={600} fz={22} className='text-nowrap! text-primary!'>
          {getWrittenContentTabs()[activeTab].label}
        </Text>
      </Group>
      <Button
        hidden={!visibleAdd}
        rightSection={<SquarePen size={16} />}
        size='xs'
        fz={16}
        fw={500}
        c={'white'}
        radius={'md'}
        className='bg-primary! shadow-lg'
        onClick={handelAdd}
      >
        إضافة
      </Button>
    </Group>
  );
}
