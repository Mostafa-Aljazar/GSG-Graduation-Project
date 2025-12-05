'use client';

import { useDisplaceds } from '@/components/actor/general/displaceds/context/displaceds-context';
import useAuth from '@/hooks/useAuth';
import useGetDelegatesNames from '@/hooks/useGetDelegatesNames';
import {
  ACCOMMODATION_TYPE,
  ACCOMMODATION_TYPE_LABELS,
  AGES,
  AGES_LABELS,
  CHRONIC_DISEASE,
  CHRONIC_DISEASE_LABELS,
  FAMILY_STATUS_TYPE,
  FAMILY_STATUS_TYPE_LABELS,
  WIFE_STATUS,
  WIFE_STATUS_LABELS,
} from '@/types/actor/common/index.type';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  displacedsFilterFormSchema,
  TDisplacedsFilterFormValues,
} from '@/validations/actor/general/displaceds/displaceds-filter-form.schema';
import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ListFilter, MessageCircleWarning, RotateCcw, Search } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

// interface CommonDisplacedFiltersProps {
//   setLocalFilters: React.Dispatch<React.SetStateAction<displacedsFilterValuesType>>;
//   displacedNum: number;

//   actor_Id: number;
//   role?: Exclude<UserRank, typeof USER_RANK.DISPLACED | typeof USER_RANK.SECURITY>;
// }

export default function AidAddDisplacedsFilters() {
  const { displacedNum, setLocalFilters, localFilters } = useDisplaceds();

  const {
    delegatesData,
    isLoading,
    error: queryDelegateError,
    hasError,
  } = useGetDelegatesNames({
    mode: ACTION_ADD_EDIT_DISPLAY.ADD,
  });

  const { user, isDelegate } = useAuth();

  const resetFilterData: TDisplacedsFilterFormValues = {
    wifeStatus: null,
    familyNumber: null,
    ages: [],
    chronicDisease: null,
    accommodationType: null,
    familyStatusType: null,
    delegate: isDelegate && user?.id ? [user.id.toString()] : [],
  };

  const initData: TDisplacedsFilterFormValues = localFilters;

  const [searchInput, setSearchInput] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [_, setSearch] = useQueryState('search', parseAsString.withDefault(''));

  const form = useForm<TDisplacedsFilterFormValues>({
    initialValues: initData,
    validate: zod4Resolver(displacedsFilterFormSchema),
  });

  const handleApplyFilters = () => {
    setLocalFilters(form.values);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    // setSearchInput('');
    // form.setValues(initData);
    // setLocalFilters(initData);
    // form.reset();
    // setResetKey((prev) => prev + 1);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearch('');
    form.reset();
    setLocalFilters(resetFilterData);
    setResetKey((prev) => prev + 1);
  };

  return (
    <Stack w='100%' mb={20} gap={20}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 10, md: 0 }}
        justify='space-between'
        align={'start'}
      >
        <Group flex={1} gap={10}>
          <Text fw={600} fz={18} className='text-primary!'>
            عدد النازحين :
          </Text>
          <Text fz={14} px={5} className='border border-second rounded-md text-dark'>
            {displacedNum ?? 0}
          </Text>
          <Text fw={500} fz={18} className='text-dark!'>
            نازح
          </Text>
        </Group>

        <Stack flex={2} gap={2}>
          <Group
            gap={0}
            wrap='nowrap'
            className='border border-gray-300 rounded-lg overflow-hidden'
          >
            <TextInput
              w={{ base: '100%' }}
              placeholder='رقم الهوية/رقم الخيمة...'
              size='sm'
              classNames={{
                input: '!border-none !outline-none placeholder:!text-sm !text-primary !font-normal',
              }}
              leftSection={<Search size={18} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              w={80}
              size='sm'
              px={10}
              fz={16}
              fw={500}
              c='dark'
              radius='none'
              className='bg-gray-300! rounded-none!'
            >
              بحث
            </Button>
          </Group>
        </Stack>
      </Flex>
      <form onSubmit={form.onSubmit(handleApplyFilters)} className='relative'>
        <LoadingOverlay
          visible={isLoading}
          zIndex={49}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />

        {hasError ? (
          <Paper p='md' withBorder m='md' className='bg-red-100! rounded-md text-center'>
            <Box>
              <Center mb='sm'>
                <ThemeIcon color='red' variant='light' size='lg'>
                  <MessageCircleWarning />
                </ThemeIcon>
              </Center>
              <Text c='red' fw={600}>
                {delegatesData?.error ||
                  queryDelegateError?.message ||
                  'حدث خطأ أثناء جلب بيانات المناديب'}
              </Text>
            </Box>
          </Paper>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing='sm'
            p={15}
            className='shadow-sm border border-gray-200 rounded-xl'
          >
            <Select
              label={
                <Text fz={16} fw={500}>
                  الزوجة :
                </Text>
              }
              placeholder='حالة الزوجة'
              data={Object.entries(WIFE_STATUS).map(([key, value]) => ({
                value: value,
                label: WIFE_STATUS_LABELS[value],
              }))}
              size='sm'
              key={`wifeStatus-${resetKey}`}
              {...form.getInputProps('wifeStatus')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              clearable
            />
            <NumberInput
              label={
                <Text fz={16} fw={500}>
                  عدد الأفراد :
                </Text>
              }
              placeholder='0'
              max={99}
              min={0}
              allowDecimal={false}
              size='sm'
              key={`familyNumber-${resetKey}`}
              {...form.getInputProps('familyNumber')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
            />
            <MultiSelect
              label={
                <Text fz={16} fw={500}>
                  أعمار الأفراد :
                </Text>
              }
              placeholder='حدد أعمار الأفراد'
              data={Object.entries(AGES).map(([key, value]) => ({
                value: value,
                label: AGES_LABELS[value],
              }))}
              size='sm'
              key={`ages-${resetKey}`}
              {...form.getInputProps('ages')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
            />
            <Select
              label={
                <Text fz={16} fw={500}>
                  حالة صحية مزمنة :
                </Text>
              }
              placeholder='الحالة'
              data={Object.entries(CHRONIC_DISEASE).map(([key, value]) => ({
                value: value,
                label: CHRONIC_DISEASE_LABELS[value],
              }))}
              size='sm'
              key={`chronicDisease-${resetKey}`}
              {...form.getInputProps('chronicDisease')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              clearable
            />
            <Select
              label={
                <Text fz={16} fw={500}>
                  نوع الإيواء :
                </Text>
              }
              placeholder='المكان'
              data={Object.entries(ACCOMMODATION_TYPE).map(([key, value]) => ({
                value: value,
                label: ACCOMMODATION_TYPE_LABELS[value],
              }))}
              size='sm'
              key={`accommodationType-${resetKey}`}
              {...form.getInputProps('accommodationType')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              clearable
            />
            <Select
              label={
                <Text fz={16} fw={500}>
                  نوع الحالة :
                </Text>
              }
              placeholder='الحالة'
              data={Object.entries(FAMILY_STATUS_TYPE).map(([key, value]) => ({
                value: value,
                label: FAMILY_STATUS_TYPE_LABELS[value],
              }))}
              size='sm'
              key={`familyStatusType-${resetKey}`}
              {...form.getInputProps('familyStatusType')}
              classNames={{
                input: 'placeholder:!text-sm !text-primary !font-normal',
              }}
              clearable
            />
            <MultiSelect
              label={
                <Text fz={16} fw={500}>
                  المندوب :
                </Text>
              }
              placeholder='اختر المندوب'
              data={(delegatesData?.delegateNames || []).map((item) => ({
                value: item.id.toString(),
                label: item.name,
              }))}
              // disabled={destination == 'AID' && role == 'DELEGATE'}
              size='sm'
              key={`delegate-${resetKey}`}
              {...form.getInputProps('delegate')}
              classNames={{
                input:
                  'placeholder:!text-sm  placeholder-shown:!hidden placeholder:!hidden !text-primary !font-normal',
              }}
              className='placeholder-shown:hidden!'
            />
            <Group visibleFrom='lg' />
            <Group flex={1} justify='end'>
              <Button
                type='button'
                size='sm'
                px={15}
                fz={16}
                fw={500}
                c='dark'
                radius='lg'
                className='justify-end! items-end! self-end! bg-gray-300! shadow-lg!'
                rightSection={<RotateCcw size={15} />}
                onClick={handleReset}
              >
                إفراغ
              </Button>
              <Button
                type='submit'
                size='sm'
                px={15}
                fz={16}
                fw={500}
                c='white'
                radius='lg'
                className='justify-end! items-end! self-end! bg-primary! shadow-lg!'
                rightSection={<ListFilter size={15} />}
              >
                فلتر
              </Button>
            </Group>
          </SimpleGrid>
        )}
      </form>
    </Stack>
  );
}
