'use client';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  Stack,
  Flex,
  Group,
  Text,
  SimpleGrid,
  Select,
  NumberInput,
  Divider,
  Button,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Package, Calendar, RotateCcw, ListFilter, Users } from 'lucide-react';
import { useAidsManagement } from '../context/aids-management-context';
import { TYPE_AIDS, getAidsTypes } from '@/types/actor/common/index.type';
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  TAidsManagementFilterFormValues,
  aidsManagementFilterFormSchema,
} from '@/validations/actor/common/aids-management/aids-management-filters-form.schema';

export default function CommonAidsManagementFilters() {
  const { setLocalFilters, aidsNum } = useAidsManagement();
  const [activePage, setActivePage] = useQueryState('aids-page', parseAsInteger.withDefault(1));
  const [resetKey, setResetKey] = useState(0);

  const initialValues: TAidsManagementFilterFormValues = {
    type: null,
    dateRange: [null, null],
    recipientsRange: [null, null],
  };

  const form = useForm<TAidsManagementFilterFormValues>({
    initialValues,
    validate: zod4Resolver(aidsManagementFilterFormSchema),
  });

  const handleReset = () => {
    form.reset();
    setResetKey((prev) => prev + 1);
    setLocalFilters(initialValues);
    setActivePage(1);
  };

  const handleApply = (values: TAidsManagementFilterFormValues) => {
    setLocalFilters({
      type: values.type ?? null,
      dateRange: [...values.dateRange],
      recipientsRange: [...values.recipientsRange],
    });
    setActivePage(1);
  };

  return (
    <Stack w='100%' mb={20} gap={20}>
      <Flex
        justify='space-between'
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 10, md: 0 }}
      >
        <Group flex={1} gap={10}>
          <Text fw={600} fz={16} className='text-primary!'>
            الفلاتر :
          </Text>
          <Text fz={16} px={5} className='border border-second rounded-md h-fit! text-dark'>
            {aidsNum ?? 0}
          </Text>
          <Text fw={600} fz={16} className='text-primary!'>
            مساعدة
          </Text>
        </Group>
      </Flex>

      <form onSubmit={form.onSubmit(handleApply)} className='flex-1!'>
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing='sm'
          p={15}
          className='shadow-md border border-gray-400 rounded-xl'
        >
          <Select
            label={
              <Text fz={16} fw={500}>
                نوع المساعدة :
              </Text>
            }
            placeholder='نوع المساعدة'
            data={Object.values(TYPE_AIDS).map((value) => ({
              value,
              label: getAidsTypes()[value].label,
            }))}
            size='sm'
            leftSection={<Package size={15} />}
            key={`type-${resetKey}`}
            {...form.getInputProps('type')}
            clearable
            classNames={{
              input: 'placeholder:!text-sm !text-primary !font-normal',
            }}
          />

          <DatePickerInput
            type='range'
            label={
              <Text fz={16} fw={500}>
                تاريخ التوزيع :
              </Text>
            }
            placeholder='نطاق اختيار التواريخ'
            leftSection={<Calendar size={15} />}
            key={`dateRange-${resetKey}`}
            {...form.getInputProps('dateRange')}
            clearable
            error={form.errors.dateRange} // Display validation error
            classNames={{
              input: 'placeholder:!text-sm !text-primary !font-normal',
            }}
          />

          <Stack gap={0}>
            <Text fz={16} fw={500}>
              عدد المستفيدين :
            </Text>
            <Group gap={0} wrap='nowrap' className='border border-gray-300 rounded-lg'>
              <NumberInput
                placeholder='من'
                size='sm'
                min={0}
                leftSection={<Users size={15} />}
                key={`recipientsRange.0-${resetKey}`}
                {...form.getInputProps('recipientsRange.0')}
                classNames={{
                  input:
                    '!border-none !outline-none placeholder:!text-sm !text-primary !font-normal',
                }}
              />
              <Divider
                orientation='vertical'
                h='100%'
                w={1}
                mx={0}
                my='auto'
                className='bg-gray-300! shrink-0'
              />
              <NumberInput
                placeholder='إلى'
                size='sm'
                min={form.values.recipientsRange[0] ?? 0}
                leftSection={<Users size={15} />}
                key={`recipientsRange.1-${resetKey}`}
                {...form.getInputProps('recipientsRange.1')}
                classNames={{
                  input:
                    '!border-none !outline-none placeholder:!text-sm !text-primary !font-normal',
                }}
              />
            </Group>
          </Stack>

          <Group flex={1} justify='end'>
            <Button
              type='button'
              w={100}
              size='sm'
              fw={500}
              radius='lg'
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
              fw={500}
              c='white'
              radius='lg'
              rightSection={<ListFilter size={16} />}
              className='justify-end! items-end! self-end! bg-primary! shadow-lg!'
            >
              فلتر
            </Button>
          </Group>
        </SimpleGrid>
      </form>
    </Stack>
  );
}
