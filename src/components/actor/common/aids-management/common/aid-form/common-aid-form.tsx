'use client';

import {
  NumberInput,
  Radio,
  Select,
  Text,
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Stack,
  Flex,
  Button,
  Card,
  Divider,
  Title,
  Box,
  ThemeIcon,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  DISTRIBUTION_MECHANISM,
  QUANTITY_AVAILABILITY,
  TYPE_AIDS,
  getAidsTypes,
} from '@/types/actor/common/index.type';
import {
  addEditAidFormSchema,
  TAddEditAidFormValues,
} from '@/validations/actor/common/aids-management/add-aid-form.schema';
import PortionsManagementModal from './distribution-methods/portions-management';
import {
  Boxes,
  Calendar,
  Gauge,
  MapPin,
  Package,
  Shield,
  TableOfContents,
  Tag,
} from 'lucide-react';
import { useEffect } from 'react';
import { useAidStore } from '@/stores/Aid.store';
import { ICategoryRange } from '@/types/actor/common/aids-management/aids-management.types';
import { AidStep } from '../../add/add-aid-editor';

const resetForm: TAddEditAidFormValues = {
  aidName: '',
  aidType: TYPE_AIDS.OTHER_AID,
  aidContent: '',
  deliveryDate: null,
  deliveryLocation: '',
  securityRequired: false,
  quantityAvailability: QUANTITY_AVAILABILITY.UNLIMITED,
  selectedCategories: [],
  distributionMechanism: DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES,
  additionalNotes: '',
  existingQuantity: undefined,
};

interface Props {
  handelActiveStep: ({ step }: { step: AidStep }) => void;
}

export default function CommonAidForm({ handelActiveStep }: Props) {
  const {
    formValues,
    selectedCategories: selectedCategoriesStored,
    resetAidStore,
    setFormValues,
    selectedDelegatesPortions,
    setSelectedDelegatesPortions,
  } = useAidStore();

  const [query] = useQueryStates({
    action: parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.ADD
    ),
    aidId: parseAsInteger.withDefault(0),
  });

  const isDisabled = query.action === ACTION_ADD_EDIT_DISPLAY.DISPLAY;

  const form = useForm<TAddEditAidFormValues>({
    initialValues: resetForm,
    validate: zod4Resolver(addEditAidFormSchema),
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (query.action === ACTION_ADD_EDIT_DISPLAY.EDIT && query.aidId !== 0 && formValues) {
      form.setValues({ ...formValues, selectedCategories: selectedCategoriesStored });
    }
  }, [formValues, query.action, query.aidId]);

  const handleSubmit = (values: TAddEditAidFormValues) => {
    setFormValues(values);

    if (values.distributionMechanism == DISTRIBUTION_MECHANISM.DELEGATES_LISTS) {
      handelActiveStep({ step: AidStep.AID_DELEGATES });
    } else {
      setSelectedDelegatesPortions([]);
      handelActiveStep({ step: AidStep.AID_DISPLACEDS });
    }
  };

  const handleCategoryChange = (categories: ICategoryRange[]) => {
    form.setFieldValue('selectedCategories', categories);
    setFormValues({ selectedCategories: categories });
  };

  const handlePortionChange = (id: string, portion: number) => {
    const updated = form.values.selectedCategories.map((c) =>
      c.id === id ? { ...c, portion } : c
    );
    form.setFieldValue('selectedCategories', updated);
    setFormValues({ selectedCategories: updated });
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)} id='add-aid-form'>
        <Stack gap='lg'>
          {/* LEFT AND RIGHT INPUTS */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='lg'>
            <Stack p='md' gap='md' className='border border-gray-200 rounded-md'>
              <TextInput
                label='عنوان المساعدة'
                placeholder='عنوان المساعدة'
                size='sm'
                leftSection={<Tag size={16} />}
                {...form.getInputProps('aidName')}
                disabled={isDisabled}
                classNames={{
                  input: 'placeholder:text-sm! text-primary! font-normal!',
                }}
              />

              <Select
                label='نوع المساعدة'
                placeholder='نوع المساعدة'
                size='sm'
                clearable
                leftSection={<Package size={16} />}
                data={Object.entries(TYPE_AIDS).map(([_, value]) => ({
                  value,
                  label: getAidsTypes()[value].label,
                }))}
                {...form.getInputProps('aidType')}
                disabled={isDisabled}
                classNames={{
                  input: 'placeholder:text-sm! text-primary! font-normal!',
                }}
                renderOption={({ option, checked }) => {
                  const Icon = getAidsTypes()[option.value as TYPE_AIDS].icon;
                  return (
                    <Group gap='xs' wrap='nowrap'>
                      {Icon && (
                        <ThemeIcon radius={100} p={2}>
                          <Icon size={16} />
                        </ThemeIcon>
                      )}
                      <Text fw={300}>{option.label}</Text>
                    </Group>
                  );
                }}
              />

              <TextInput
                label='محتوى المساعدة'
                placeholder='محتوى المساعدة'
                size='sm'
                leftSection={<TableOfContents size={16} />}
                {...form.getInputProps('aidContent')}
                disabled={isDisabled}
                classNames={{
                  input: 'placeholder:text-sm! text-primary! font-normal!',
                }}
              />

              <DateTimePicker
                label='موعد التسليم'
                size='sm'
                leftSection={<Calendar size={16} />}
                {...form.getInputProps('deliveryDate')}
                disabled={isDisabled}
                classNames={{
                  input: 'placeholder:text-sm! text-primary! font-normal!',
                }}
              />

              <TextInput
                label='مكان التسليم'
                placeholder='مكان التسليم'
                size='sm'
                leftSection={<MapPin size={16} />}
                {...form.getInputProps('deliveryLocation')}
                disabled={isDisabled}
                classNames={{
                  input: 'placeholder:text-sm! text-primary! font-normal!',
                }}
              />
            </Stack>

            <Stack p='md' gap='md' className='border border-gray-200 rounded-md'>
              <Stack gap='xs'>
                <Group gap={5}>
                  <Shield size={16} />
                  <Text size='sm' fw={500}>
                    يلزم تأمين
                  </Text>
                </Group>

                <Radio.Group
                  value={form.values.securityRequired ? '1' : '0'}
                  onChange={(val) => form.setFieldValue('securityRequired', val === '1')}
                >
                  <Group gap={30}>
                    <Radio
                      value='0'
                      label='لا'
                      size='sm'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                    <Radio
                      value='1'
                      label='نعم'
                      size='sm'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                  </Group>
                </Radio.Group>
              </Stack>

              <Stack gap='xs'>
                <Group gap={5}>
                  <Gauge size={16} />
                  <Text size='sm' fw={500}>
                    مقدار الكمية
                  </Text>
                </Group>

                <Radio.Group {...form.getInputProps('quantityAvailability')}>
                  <Group gap={30}>
                    <Radio
                      value={QUANTITY_AVAILABILITY.LIMITED}
                      label='محدود'
                      size='sm'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                    <Radio
                      value={QUANTITY_AVAILABILITY.UNLIMITED}
                      label='غير محدود'
                      size='sm'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                  </Group>
                </Radio.Group>
              </Stack>

              {form.values.quantityAvailability === QUANTITY_AVAILABILITY.LIMITED && (
                <NumberInput
                  label='الكمية الموجودة'
                  min={1}
                  size='sm'
                  leftSection={<Boxes size={16} />}
                  {...form.getInputProps('existingQuantity')}
                  disabled={isDisabled}
                />
              )}

              <Stack gap='xs'>
                <Group gap={5}>
                  <Gauge size={16} />
                  <Text size='sm' fw={500}>
                    آلية التوزيع
                  </Text>
                </Group>

                <Radio.Group {...form.getInputProps('distributionMechanism')}>
                  <Flex gap={20} wrap='wrap'>
                    <Radio
                      value={DISTRIBUTION_MECHANISM.DELEGATES_LISTS}
                      label='بناءً على كشوفات المناديب'
                      size='md'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                    <Radio
                      value={DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES}
                      label='بناءً على العائلات النازحة'
                      size='md'
                      disabled={isDisabled}
                      classNames={{
                        label: 'text-primary! font-normal!',
                      }}
                    />
                  </Flex>
                </Radio.Group>
              </Stack>
            </Stack>
          </SimpleGrid>

          <Stack gap='md'>
            <Textarea
              label='الملحقات'
              size='sm'
              autosize
              minRows={3}
              {...form.getInputProps('additionalNotes')}
              disabled={isDisabled}
              classNames={{
                input: 'placeholder:text-sm! text-primary! font-normal!',
              }}
            />

            <PortionsManagementModal
              selectedCategories={form.values.selectedCategories}
              onCategoriesChange={handleCategoryChange}
              onPortionChange={handlePortionChange}
              isDisabled={isDisabled}
            />

            {form.errors.selectedCategories && (
              <Text c='red' size='xs'>
                {form.errors.selectedCategories}
              </Text>
            )}
          </Stack>

          <Group justify='left'>
            <Button type='submit' size='md' w={100} disabled={isDisabled}>
              التالي
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
