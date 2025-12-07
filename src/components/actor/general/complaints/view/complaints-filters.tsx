'use client';
import { Button, Group, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Activity, Calendar, ListFilter, RotateCcw, Search } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { COMPLAINTS_STATUS, COMPLAINTS_STATUS_LABELS } from '@/types/actor/common/index.type';
import { useComplaintsStore } from '../context/complaints-context';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  complaintFilterFormSchema,
  TComplaintFilterFormValues,
} from '@/validations/actor/general/complaints/complaints.schema';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import SendComplaint from '../send-complaint';

export default function ComplaintsFilters() {
  const { setLocalFilters, localFilters, complaintsNum } = useComplaintsStore();
  const { userId: userAlreadyId, userType: userAlreadyType } = useAlreadyUserStore();

  const { user, isManager } = useAuth();
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    'complaints-page': parseAsInteger.withDefault(1),
  });
  const [resetKey, setResetKey] = useState(0);

  const resetFilterData: TComplaintFilterFormValues = {
    status: null,
    dateRange: [null, null],
  };

  const initData: TComplaintFilterFormValues = localFilters;

  const form = useForm<TComplaintFilterFormValues>({
    initialValues: initData,
    validate: zod4Resolver(complaintFilterFormSchema),
  });

  const [searchInput, setSearchInput] = useState('');

  const handleApplyFilters = () => {
    setLocalFilters(form.values);
  };

  const handleSearch = () => {
    setQuery({ search: searchInput, 'complaints-page': 1 });
  };

  const handleReset = () => {
    setSearchInput('');
    setQuery({ search: '', 'complaints-page': 1 });
    form.reset();
    setLocalFilters(resetFilterData);
    setResetKey((prev) => prev + 1);
  };

  const isOwner = user?.id == userAlreadyId && user?.role == userAlreadyType;
  return (
    <Stack w='100%' mb={20} gap={20}>
      <Group justify={'space-between'}>
        <Group flex={1} gap={10}>
          <Text fw={600} fz={18} className='text-primary!'>
            الفلاتر :
          </Text>
          <Text fz={14} px={5} className='border border-second rounded-md text-dark'>
            {complaintsNum ?? 0}
          </Text>
          <Text fw={500} fz={18} className='text-dark!'>
            شكوى
          </Text>
        </Group>

        {isOwner && !isManager && <SendComplaint />}
      </Group>

      <Group
        flex={1}
        gap={0}
        wrap='nowrap'
        className='border border-gray-300 rounded-lg overflow-hidden'
      >
        <TextInput
          w={{ base: '100%' }}
          placeholder='رقم الهوية/الاسم ...'
          size='sm'
          value={searchInput}
          classNames={{
            input: '!border-none !outline-none placeholder:!text-sm text-primary! !font-normal',
          }}
          leftSection={<Search size={18} />}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          w={80}
          size='sm'
          px={10}
          fz={16}
          fw={500}
          c={'dark'}
          radius={'none'}
          value={''}
          className='bg-gray-300! rounded-none!'
          onClick={handleSearch}
        >
          بحث
        </Button>
      </Group>
      <form onSubmit={form.onSubmit(handleApplyFilters)}>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing='sm'
          p={15}
          className='shadow-md border border-gray-400 rounded-xl'
        >
          <Select
            label={
              <Text fz={16} fw={500}>
                حالة الشكوى :
              </Text>
            }
            placeholder='حالة الشكوى'
            data={Object.entries(COMPLAINTS_STATUS).map(([key, value]) => ({
              value: value,
              label: COMPLAINTS_STATUS_LABELS[value],
            }))}
            size='sm'
            leftSection={<Activity size={15} />}
            key={`status-${resetKey}`}
            {...form.getInputProps('status')}
            classNames={{
              input: 'placeholder:!text-sm text-primary! !font-normal',
            }}
            clearable
          />

          <DatePickerInput
            type='range'
            label={
              <Text fz={16} fw={500}>
                تاريخ الإرسال :
              </Text>
            }
            placeholder='نطاق اختيار التواريخ'
            leftSection={<Calendar size={15} />}
            key={`dateRange-${resetKey}`}
            {...form.getInputProps('dateRange')}
            classNames={{
              input: 'placeholder:!text-sm text-primary! !font-normal',
            }}
            clearable
          />

          <Group flex={1} justify='end'>
            <Button
              size='sm'
              radius='md'
              type='button'
              w={100}
              px={15}
              fz={16}
              fw={500}
              c={'dark'}
              className='justify-end! items-end! self-end! bg-gray-300! shadow-lg!'
              rightSection={<RotateCcw size={16} />}
              onClick={handleReset}
            >
              إفراغ
            </Button>
            <Button
              type='submit'
              w={100}
              size='sm'
              radius='md'
              px={15}
              fz={16}
              fw={500}
              c={'white'}
              className='justify-end! items-end! self-end! bg-primary! shadow-lg!'
              rightSection={<ListFilter size={16} />}
            >
              فلتر
            </Button>
          </Group>
        </SimpleGrid>
      </form>
    </Stack>
  );
}
