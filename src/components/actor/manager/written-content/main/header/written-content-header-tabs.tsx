'use client';

import { getWrittenContentTabs, TYPE_WRITTEN_CONTENT } from '@/types/common/index.type';
import { Divider, FloatingIndicator, Group, Stack, Tabs, Text, ThemeIcon } from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useRef, useEffect, useState } from 'react';

const TABS = [
  TYPE_WRITTEN_CONTENT.ADS,
  TYPE_WRITTEN_CONTENT.BLOG,
  TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
] as const;

export default function WrittenContentHeaderTabs() {
  const [query, setQuery] = useQueryStates({
    'written-tab': parseAsStringEnum<TYPE_WRITTEN_CONTENT>(
      Object.values(TYPE_WRITTEN_CONTENT)
    ).withDefault(TYPE_WRITTEN_CONTENT.BLOG),
    'written-page': parseAsInteger.withDefault(1),
  });

  const activeTab = query['written-tab'];

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicatorTarget, setIndicatorTarget] = useState<HTMLElement | null>(null);
  const [indicatorParent, setIndicatorParent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const targetEl = controlRefs.current[activeTab];
    if (targetEl) {
      setIndicatorTarget(targetEl);
    }
  }, [activeTab]);

  useEffect(() => {
    if (rootRef.current) {
      setIndicatorParent(rootRef.current);
    }
  }, []);

  const setControlRef = (key: string) => (node: HTMLButtonElement | null) => {
    controlRefs.current[key] = node;
    if (key === activeTab && node) {
      setIndicatorTarget(node);
    }
  };

  return (
    <Stack justify='center' align='center' pt={20} w='100%'>
      <Tabs
        value={activeTab}
        onChange={(value) =>
          value && setQuery({ 'written-page': 1, 'written-tab': value as TYPE_WRITTEN_CONTENT })
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
              const { icon: Icon, label } = getWrittenContentTabs()[tabKey];
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
                className='bg-primary mx-0 my-auto'
                style={{
                  position: 'absolute',
                  left: `${((i + 1) / TABS.length) * 100}%`,
                  transform: 'translateX(-50%)',
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
