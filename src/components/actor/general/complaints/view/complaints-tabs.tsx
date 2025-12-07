'use client';

import { COMPLAINTS_TABS, getComplaintsTabs } from '@/types/actor/common/index.type';
import { Divider, FloatingIndicator, Group, Stack, Tabs, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useRef, useEffect, useState } from 'react';

const TABS = Object.values(COMPLAINTS_TABS) as COMPLAINTS_TABS[];

export default function ComplaintsHeaderTabs() {
  const [query, setQuery] = useQueryStates({
    'complaints-tab': parseAsStringEnum<COMPLAINTS_TABS>(TABS).withDefault(
      COMPLAINTS_TABS.SENT_COMPLAINTS
    ),
    'complaints-page': parseAsInteger.withDefault(1),
  });

  const activeTab = query['complaints-tab'];

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRefs = useRef<Record<COMPLAINTS_TABS, HTMLButtonElement | null>>({
    [COMPLAINTS_TABS.SENT_COMPLAINTS]: null,
    [COMPLAINTS_TABS.RECEIVED_COMPLAINTS]: null,
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

  const setControlRef = (key: COMPLAINTS_TABS) => (node: HTMLButtonElement | null) => {
    controlRefs.current[key] = node;
    if (key === activeTab && node) setIndicatorTarget(node);
  };

  return (
    <Stack justify='center' align='center' pt={20} w='100%'>
      <Tabs
        value={activeTab}
        onChange={(value) =>
          value && setQuery({ 'complaints-tab': value as COMPLAINTS_TABS, 'complaints-page': 1 })
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
              const { label, icon: Icon } = getComplaintsTabs()[tabKey];
              const isActive = activeTab === tabKey;

              return (
                <Tabs.Tab
                  key={tabKey}
                  value={tabKey}
                  ref={setControlRef(tabKey)}
                  className='flex-1 py-4'
                >
                  <Group gap={8} justify='center' wrap='nowrap'>
                    {Icon && (
                      <ThemeIcon
                        variant='transparent'
                        size={20}
                        c={isActive ? 'primary' : 'dimmed'}
                      >
                        <Icon size={20} />
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
            style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </Tabs.List>
      </Tabs>
    </Stack>
  );
}
