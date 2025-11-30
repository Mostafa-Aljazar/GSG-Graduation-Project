'use client';

import {
  Modal,
  Text,
  Group,
  Stack,
  Divider,
  ThemeIcon,
  Grid,
  Paper,
  Badge,
  LoadingOverlay,
} from '@mantine/core';
import { ClipboardList, Clock, UserRoundCheck, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { startTransition, useEffect, useState } from 'react';
import { ITask } from '@/types/actor/security/tasks/TasksResponse.type';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { formatDate } from '@/utils/formatDate';
import { getSecurityNames } from '@/actions/actor/general/security-data/getSecurityNames';
import { ISecuritiesNamesResponse } from '@/types/actor/general/security-data/securitiesResponse.types';

interface ISecurityTaskModalProps {
  opened: boolean;
  onClose: () => void;
  task: ITask;
}

interface ISecurityMan {
  id: string;
  name: string;
}

export default function ViewTaskModal({ opened, onClose, task }: ISecurityTaskModalProps) {
  const isCompleted = task.type === TASKS_TABS.COMPLETED_TASKS;

  const formattedDate = task.dateTime ? formatDate(new Date(task.dateTime), 'yyyy-MM-dd') : '';
  const formattedTime = task.dateTime ? formatDate(new Date(task.dateTime), 'HH:mm') : '';

  const [securityData, setSecurityData] = useState<ISecurityMan[]>([]);

  const { data: securityNames, isLoading } = useQuery<ISecuritiesNamesResponse>({
    queryKey: ['security-names-by-id', task.id],
    queryFn: () => getSecurityNames({ ids: task.securitiesIds }),
  });

  useEffect(() => {
    if (securityNames?.securitiesNames) {
      const securityNamesMapped = securityNames.securitiesNames.map((security) => ({
        ...security,
        id: security.id.toString(),
      }));
      startTransition(() => {
        setSecurityData(securityNamesMapped);
      });
    }
  }, [securityNames]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size='lg'
      radius='md'
      withCloseButton
      title={
        <Text fz={18} fw={600} ta='center' className='text-primary!'>
          تفاصيل المهمة الأمنية
        </Text>
      }
      classNames={{ title: '!w-full' }}
      centered
      onClick={(e) => e.stopPropagation()}
    >
      <LoadingOverlay visible={isLoading} zIndex={49} overlayProps={{ radius: 'sm', blur: 0.3 }} />

      <Stack gap='md'>
        <Group mb='xs'>
          <Badge color={isCompleted ? 'green' : 'blue'} variant='light' size='lg' radius='sm'>
            {isCompleted ? 'مهمة منجزة' : 'مهمة قادمة'}
          </Badge>
        </Group>

        <Divider />

        <Grid gutter='sm'>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius='md' p='sm' bg='gray.0'>
              <Group gap='xs' align='start'>
                <ThemeIcon variant='light' color='indigo' size='sm'>
                  <ClipboardList size={18} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size='xs' c='dimmed'>
                    عنوان المهمة
                  </Text>
                  <Text size='sm'>{task.title}</Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius='md' p='sm' bg='gray.0'>
              <Group gap='xs' align='start'>
                <ThemeIcon variant='light' color='teal' size='sm'>
                  <Clock size={18} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size='xs' c='dimmed'>
                    التاريخ والوقت
                  </Text>
                  <Text size='sm'>
                    {formattedDate} - {formattedTime}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder radius='md' p='sm' bg='gray.0'>
              <Group gap='xs' align='start'>
                <ThemeIcon variant='light' color='orange' size='sm'>
                  <UserRoundCheck size={18} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size='xs' c='dimmed'>
                    عناصر الأمن
                  </Text>
                  <Text size='sm'>{securityData.map((item) => `- ${item.name}`).join(' ')}</Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder radius='md' p='sm' bg='gray.0'>
              <Group gap='xs' align='start'>
                <ThemeIcon variant='light' color='grape' size='sm'>
                  <FileText size={18} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size='xs' c='dimmed'>
                    تفاصيل المهمة
                  </Text>
                  <Text size='sm'>{task.body}</Text>
                </Stack>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  );
}
