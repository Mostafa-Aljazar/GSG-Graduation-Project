'use client';

import { COMPLAINTS_TABS, GET_COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { cn } from '@/utils/cn';
import { Divider, FloatingIndicator, Group, Stack, Tabs, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useState, useRef } from 'react';

export default function CommonComplaintsHeaderTabs() {
  const [query, setQuery] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(
      Object.values(COMPLAINTS_TABS)
    ).withDefault(COMPLAINTS_TABS.SENT_COMPLAINTS),
    'complaints-page': parseAsInteger.withDefault(1),
  });

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const controlsRefs = useRef<Record<COMPLAINTS_TABS, HTMLButtonElement | null>>({
    [COMPLAINTS_TABS.SENT_COMPLAINTS]: null,
    [COMPLAINTS_TABS.RECEIVED_COMPLAINTS]: null,
  });

  const setControlRef = (tabKey: COMPLAINTS_TABS) => (node: HTMLButtonElement | null) => {
    controlsRefs.current[tabKey] = node;
  };

  const activeTabSection = (tabKey: COMPLAINTS_TABS) => {
    const { label, icon: IconComponent } = GET_COMPLAINTS_TABS[tabKey];
    return (
      <Tabs.Tab
        value={tabKey}
        flex={1}
        w={'100%'}
        pos={'relative'}
        className='flex justify-center items-center'
        ref={setControlRef(tabKey)}
      >
        <Group flex={1} wrap='nowrap' gap={3} justify='center' align='center'>
          {IconComponent && (
            <ThemeIcon variant='transparent' className='flex-shrink-0 !text-dark' size={18}>
              <IconComponent size={18} />
            </ThemeIcon>
          )}
          <Text
            ta={'center'}
            fz={{ base: 14, md: 16 }}
            lh={1.25}
            className={cn(
              '!overflow-ellipsis overflow-hidden !text-nowrap',
              query['complaints-tab'] === tabKey
                ? '!text-primary !font-bold'
                : '!font-medium !text-[#817C74]'
            )}
          >
            {label}
          </Text>
        </Group>
      </Tabs.Tab>
    );
  };

  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'}>
      <Tabs
        value={query['complaints-tab']}
        variant='unstyled'
        onChange={(value: string | null) => {
          if (value) {
            setQuery({
              'complaints-tab': value as COMPLAINTS_TABS,
              'complaints-page': 1,
            });
          }
        }}
        w={'100%'}
      >
        <Tabs.List
          w={{ base: '100%', md: '80%' }}
          mx={'auto'}
          pos={'relative'}
          className='shadow-lg border-[#DFDEDC] border-1 rounded-xl overflow-hidden'
          ref={setRootRef}
        >
          <Group
            w={'100%'}
            flex={1}
            wrap='nowrap'
            justify='space-between'
            align='center'
            gap={0}
            p={0}
          >
            {activeTabSection(COMPLAINTS_TABS.SENT_COMPLAINTS)}
            <Divider
              orientation='vertical'
              h={'50%'}
              w={2}
              mx={0}
              my={'auto'}
              className='flex-shrink-0 !bg-primary'
            />
            {activeTabSection(COMPLAINTS_TABS.RECEIVED_COMPLAINTS)}
          </Group>
          <FloatingIndicator
            target={controlsRefs.current[query['complaints-tab']]}
            parent={rootRef}
            className='!border-b-2 border-b-primary'
          />
        </Tabs.List>
      </Tabs>
    </Stack>
  );
}
