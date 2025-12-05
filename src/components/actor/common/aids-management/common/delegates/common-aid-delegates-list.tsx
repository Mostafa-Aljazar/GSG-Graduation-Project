'use client';
import { Group, Stack, Text } from '@mantine/core';
import { Database } from 'lucide-react';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import CommonAidDelegatesTable from './common-aid-delegates-table';
import { AidStep } from '../../add/add-aid-editor';
import { Suspense } from 'react';

function AidDelegatesListHeader() {
  const [action] = useQueryState(
    'action',
    parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.ADD
    )
  );

  const title =
    action == ACTION_ADD_EDIT_DISPLAY.ADD
      ? 'إضافة مناديب للمساعدة'
      : action == ACTION_ADD_EDIT_DISPLAY.EDIT
      ? 'تعديل المناديب المستقبلين '
      : 'بيانات المناديب';

  return (
    <Group justify='right' align='center'>
      <Group gap={10}>
        <Database size={20} className='text-primary!' />
        <Text fw={600} fz={18} className='text-primary!'>
          {title} :
        </Text>
      </Group>
    </Group>
  );
}

interface ICommonAidDelegatesListProps {
  handelActiveStep: ({ step }: { step: AidStep }) => void;
}

export default function CommonAidDelegatesList({ handelActiveStep }: ICommonAidDelegatesListProps) {
  return (
    <Stack p={10} pos='relative' w='100%'>
      <AidDelegatesListHeader />

      <Suspense fallback={<div>جارٍ التحميل...</div>}>
        <CommonAidDelegatesTable handelActiveStep={handelActiveStep} />
      </Suspense>
    </Stack>
  );
}
