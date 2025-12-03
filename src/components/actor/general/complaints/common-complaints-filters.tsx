'use client';
import { Button, Group, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { Activity, Calendar, ListFilter, RotateCcw, Search } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Dispatch, SetStateAction, useState } from 'react';
import { CommonComplaintFilterFormSchema, TCommonComplaintFilterFormValues } from '@/validations/actor/general/complaints/commonComplaintsSchema';
import CommonSendComplaint from './common-send-complaint';
import useAuth from '@/hooks/useAuth';
import { USER_TYPE, TUserRank, TUserType } from '@/constants/user-types';
import { COMPLAINTS_STATUS, COMPLAINTS_STATUS_LABELS } from '@/types/actor/common/index.type';

interface ICommonComplaintsFiltersProps {
  setLocalFilters: Dispatch<SetStateAction<TCommonComplaintFilterFormValues>>;
  complaintsNum?: number;

  actor_Id: number;
  role: TUserType | TUserRank;
}

export default function Common_Complaints_Filters({
  setLocalFilters,
  complaintsNum,
  actor_Id,
  role,
}: ICommonComplaintsFiltersProps) {
  const { user } = useAuth();
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    'complaints-page': parseAsInteger.withDefault(1),
  });

  const form = useForm<TCommonComplaintFilterFormValues>({
    initialValues: {
      status: null,
      date_range: [null, null],
    },

    validate: zodResolver(CommonComplaintFilterFormSchema),
  });

  const [searchInput, setSearchInput] = useState('');

  const handleReset = () => {
    form.reset();
    setSearchInput('');
    setLocalFilters({
      status: null,
      date_range: [null, null],
    });
    setQuery({ 'complaints-page': 1 });
  };

  const handleSearch = () => {
    setLocalFilters({
      status: null,
      date_range: [null, null],
    });

    setQuery({ search: searchInput, 'complaints-page': 1 });
    setSearchInput('');
    form.reset();
  };

  const handleApplyFilters = (values: TCommonComplaintFilterFormValues) => {
    setLocalFilters({
      status: values.status,
      date_range: values.date_range, // Keep as [string | null, string | null]
    });
    setQuery({ 'complaints-page': 1 });
  };

  const isOwner = user?.id == actor_Id && user?.role == role;
  return (
    <Stack w='100%' mb={20} gap={20}>
      <Group justify={'space-between'}>
        <Group flex={1} gap={10}>
          <Text fw={600} fz={18} className='!text-primary'>
            الفلاتر :
          </Text>
          <Text fz={14} px={5} className='border-1 border-second rounded-md text-dark'>
            {complaintsNum ?? 0}
          </Text>
          <Text fw={500} fz={18} className='!text-dark'>
            شكوى
          </Text>
        </Group>

        {isOwner && role !== USER_TYPE.MANAGER && <CommonSendComplaint />}
      </Group>

      <Group
        flex={1}
        gap={0}
        wrap='nowrap'
        className='border-1 border-gray-300 rounded-lg overflow-hidden'
      >
        <TextInput
          w={{ base: '100%' }}
          placeholder='رقم الهوية/الاسم ...'
          size='sm'
          value={searchInput}
          classNames={{
            input: '!border-none !outline-none placeholder:!text-sm !text-primary !font-normal',
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
          className='!bg-gray-300 !rounded-none'
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
          className='shadow-md border-1 border-gray-400 rounded-xl'
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
            {...form.getInputProps('status')}
            classNames={{
              input: 'placeholder:!text-sm !text-primary !font-normal',
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
            {...form.getInputProps('date_range')}
            classNames={{
              input: 'placeholder:!text-sm !text-primary !font-normal',
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
              className='!justify-end !items-end !self-end !bg-gray-300 !shadow-lg'
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
              className='!justify-end !items-end !self-end !bg-primary !shadow-lg'
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
