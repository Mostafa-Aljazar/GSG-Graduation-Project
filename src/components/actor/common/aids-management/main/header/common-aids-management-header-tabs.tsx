'use client';

import { getAidsManagementTabs, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { Divider, FloatingIndicator, Group, Stack, Tabs, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useRef, useEffect, useState } from 'react';
import type { ElementType } from 'react';

const TABS = Object.values(TYPE_GROUP_AIDS) as TYPE_GROUP_AIDS[];

export default function CommonAidsManagementHeaderTabs() {
  const [query, setQuery] = useQueryStates({
    'aids-tab': parseAsStringEnum<TYPE_GROUP_AIDS>(TABS).withDefault(TYPE_GROUP_AIDS.ONGOING_AIDS),
    'aids-page': parseAsInteger.withDefault(1),
  });

  const activeTab = query['aids-tab'];

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRefs = useRef<Record<TYPE_GROUP_AIDS, HTMLButtonElement | null>>({
    [TYPE_GROUP_AIDS.PREVIOUS_AIDS]: null,
    [TYPE_GROUP_AIDS.ONGOING_AIDS]: null,
    [TYPE_GROUP_AIDS.COMING_AIDS]: null,
  });

  const [indicatorTarget, setIndicatorTarget] = useState<HTMLElement | null>(null);
  const [indicatorParent, setIndicatorParent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const targetEl = controlRefs.current[activeTab];
    if (targetEl) setIndicatorTarget(targetEl);
  }, [activeTab]);

  useEffect(() => {
    if (rootRef.current) setIndicatorParent(rootRef.current);
  }, []);

  const setControlRef = (key: TYPE_GROUP_AIDS) => (node: HTMLButtonElement | null) => {
    controlRefs.current[key] = node;
    if (key === activeTab && node) setIndicatorTarget(node);
  };

  return (
    <Stack justify='center' align='center' pt={20} w='100%'>
      <Tabs
        value={activeTab}
        onChange={(value) =>
          value && setQuery({ 'aids-tab': value as TYPE_GROUP_AIDS, 'aids-page': 1 })
        }
        variant='unstyled'
        w='100%'
      >
        <Tabs.List
          ref={rootRef}
          pos='relative'
          w={{ base: '100%', md: '80%' }}
          mx='auto'
          className='shadow-lg border border-[#DFDEDC] rounded-xl overflow-hidden'
        >
          <Group gap={0} justify='space-between' w='100%'>
            {TABS.map((tabKey) => {
              const { label, icon } = getAidsManagementTabs()[tabKey];
              const isActive = activeTab === tabKey;
              const IconComponent = icon as ElementType; // cast here

              return (
                <Tabs.Tab
                  key={tabKey}
                  value={tabKey}
                  ref={setControlRef(tabKey)}
                  className='flex-1 py-4'
                >
                  <Group gap={8} justify='center' wrap='nowrap'>
                    {IconComponent && (
                      <ThemeIcon
                        variant='transparent'
                        size={20}
                        c={isActive ? 'primary' : 'dimmed'}
                      >
                        <IconComponent size={20} />
                      </ThemeIcon>
                    )}
                    <Text
                      fz={{ base: 14, md: 16 }}
                      fw={isActive ? 'bold' : 500}
                      c={isActive ? 'primary' : '#817C74'}
                      className='text-nowrap'
                    >
                      {label}
                    </Text>
                  </Group>
                </Tabs.Tab>
              );
            })}

            {TABS.slice(0, -1).map((_, i) => (
              <Divider
                key={i}
                orientation='vertical'
                h='50%'
                className='bg-primary mx-0 my-auto!'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${((i + 1) / TABS.length) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                }}
              />
            ))}
          </Group>

          <FloatingIndicator
            target={indicatorTarget}
            parent={indicatorParent}
            className='border-b-2! border-b-primary'
            style={{
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Tabs.List>
      </Tabs>
    </Stack>
  );
}
