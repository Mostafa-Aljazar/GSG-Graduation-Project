'use client';

import {
  Modal,
  Stack,
  Paper,
  Text,
  TextInput,
  NumberInput,
  Button,
  Group,
  SimpleGrid,
  Checkbox,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Edit, Plus, Trash2 } from 'lucide-react';

import {
  categoryRangeSchema,
  TCategoryRangeFormValues,
} from '@/validations/actor/common/aids-management/add-aid-form.schema';
import { ICategoryRange } from '@/types/actor/common/aids-management/aids-management.types';

interface Props {
  opened: boolean;
  onClose: () => void;
  categories: ICategoryRange[];
  editingCategory: ICategoryRange | null;
  setEditingCategory: (cat: ICategoryRange | null) => void;
  addOrEditCategory: (cat: ICategoryRange) => void;
  deleteCategory: (id: string) => void;
  resetToDefault: () => void;
}

export function CategoryManagementModal({
  opened,
  onClose,
  categories,
  editingCategory,
  setEditingCategory,
  addOrEditCategory,
  deleteCategory,
  resetToDefault,
}: Props) {
  const form = useForm<TCategoryRangeFormValues & { isOpenEnded: boolean }>({
    initialValues: { id: '', label: '', min: 1, max: 3, portion: 1, isOpenEnded: false },

    validateInputOnChange: true,

    validate: (values) => {
      try {
        categoryRangeSchema.parse({
          ...values,
          max: values.isOpenEnded ? null : values.max,
        });
        return {};
      } catch (err: any) {
        return err.formErrors?.fieldErrors || {};
      }
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const category: ICategoryRange = {
      id: values.label,
      label: values.label,
      min: values.min,
      max: values.isOpenEnded ? null : values.max,
      portion: values.portion,
      isDefault: false,
    };

    addOrEditCategory(category);
    form.reset();
    setEditingCategory(null);
  };

  const handleEdit = (cat: ICategoryRange) => {
    if (cat.isDefault) return;

    setEditingCategory(cat);
    form.setValues({
      label: cat.label,
      min: cat.min,
      max: cat.max ?? cat.min + 1,
      portion: cat.portion ?? 1,
      isOpenEnded: cat.max === null,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size='lg'
      centered
      title={
        <Text fz={18} fw={600} ta='center'>
          إدارة الفئات
        </Text>
      }
    >
      <Stack gap='lg'>
        {/* Add / Edit Form */}
        <Paper p='md' withBorder shadow='sm' radius='md'>
          <Text mb='sm' fw={500}>
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={2} spacing='sm'>
              <TextInput label='تسمية الفئة' {...form.getInputProps('label')} size='sm' />
              <NumberInput label='الحد الأدنى' min={1} {...form.getInputProps('min')} size='sm' />
              <Checkbox
                label='فئة مفتوحة'
                {...form.getInputProps('isOpenEnded', { type: 'checkbox' })}
              />
              {!form.values.isOpenEnded && (
                <NumberInput
                  label='الحد الأقصى'
                  min={form.values.min + 1}
                  {...form.getInputProps('max')}
                  size='sm'
                />
              )}
            </SimpleGrid>

            <Group mt='md' gap='sm'>
              {editingCategory && (
                <Button
                  size='sm'
                  variant='outline'
                  color='red'
                  onClick={() => setEditingCategory(null)}
                >
                  إلغاء
                </Button>
              )}

              <Button
                type='button'
                onClick={() => form.onSubmit(handleSubmit)()}
                size='sm'
                leftSection={editingCategory ? <Edit size={14} /> : <Plus size={14} />}
              >
                {editingCategory ? 'تحديث' : 'إضافة'}
              </Button>
            </Group>
          </form>
        </Paper>

        {/* Current Categories */}
        <Paper p='md' withBorder shadow='sm' radius='md'>
          <Group mb='sm'>
            <Text fw={500}>الفئات الحالية</Text>
            <Button size='xs' variant='outline' color='gray' onClick={resetToDefault}>
              الافتراضي
            </Button>
          </Group>

          <Stack gap='sm'>
            {categories.map((cat) => (
              <Group
                key={cat.id}
                align='center'
                p='xs'
                style={{
                  borderRadius: 6,
                  border: '1px solid #eaeaea',
                  justifyContent: 'space-between',
                }}
              >
                <Group gap='md'>
                  <Text fw={500}>{cat.label}</Text>
                  <Badge color='blue' variant='light'>
                    {cat.max ? `${cat.min}-${cat.max}` : `${cat.min}+`}
                  </Badge>
                  <Text color='dimmed'>الحصة {cat.portion}</Text>
                </Group>

                <Group gap='xs'>
                  {!cat.isDefault && (
                    <>
                      <Button
                        size='xs'
                        onClick={() => handleEdit(cat)}
                        leftSection={<Edit size={14} />}
                      >
                        تعديل
                      </Button>
                      <Button
                        size='xs'
                        color='red'
                        onClick={() => deleteCategory(cat.id)}
                        leftSection={<Trash2 size={14} />}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </Group>
              </Group>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Modal>
  );
}
