'use client';

import {
  Stack,
  Paper,
  Group,
  MultiSelect,
  ScrollArea,
  Table,
  NumberInput,
  Text,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { Users, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

import { ICategoryRange } from '@/types/actor/common/aids-management/aids-management.types';
import { DEFAULT_CATEGORIES } from '@/types/actor/common/index.type';
import { CategoryManagementModal } from './category-management-modal';
import { useAidStore } from '@/stores/Aid.store';

export function rangesOverlap(
  a: { min: number; max: number | null },
  b: { min: number; max: number | null }
) {
  const aMax = a.max ?? Infinity;
  const bMax = b.max ?? Infinity;
  return a.min <= bMax && b.min <= aMax;
}

interface PortionsManagementModalProps {
  isDisabled: boolean;
  selectedCategories: ICategoryRange[];
  onCategoriesChange: (categories: ICategoryRange[]) => void;
  onPortionChange?: (id: string, portion: number) => void;
}

export default function PortionsManagementModal({
  isDisabled,
  selectedCategories,
  onCategoriesChange,
  onPortionChange,
}: PortionsManagementModalProps) {
  const [managementOpened, { open: openManagement, close: closeManagement }] = useDisclosure(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryRange | null>(null);
  const {
    updateCategory,
    addCategory,
    setFormValues,
    formValues,
    selectedCategories: selectedStoredCategories,
  } = useAidStore();
  // Track all categories including newly added ones
  const [allCategories, setAllCategories] = useState<ICategoryRange[]>(DEFAULT_CATEGORIES);

  // Merge selected categories with allCategories to show in MultiSelect
  const categories = useMemo(() => {
    const map = new Map(allCategories.map((c) => [c.id, c]));
    selectedCategories.forEach((cat) => map.set(cat.id, cat));
    return Array.from(map.values());
  }, [selectedCategories, allCategories]);

  const addOrEditCategory = (cat: ICategoryRange) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, cat);
    } else {
      addCategory(cat);
    }
    setEditingCategory(null);
  };

  const updateCategoryPortion = (id: string, portion: number) => {
    const updated = selectedCategories.map((c) => (c.id === id ? { ...c, portion } : c));
    onCategoriesChange(updated);
    onPortionChange?.(id, portion);
  };

  const disabledBecauseOverlap = (c: ICategoryRange) =>
    selectedCategories.some((sel) => sel.id !== c.id && rangesOverlap(sel, c));

  return (
    <Stack gap='md'>
      <Paper p='md' withBorder>
        <Group justify='space-between' mb={10}>
          <Text fz={16} fw={500}>
            تحديد الحصص حسب عدد الأفراد
          </Text>
          <ActionIcon onClick={openManagement} disabled={isDisabled}>
            <Settings size={16} />
          </ActionIcon>
        </Group>

        <MultiSelect
          data={categories.map((c) => ({
            value: c.id,
            label: c.label,
            disabled: disabledBecauseOverlap(c),
          }))}
          value={selectedCategories.map((c) => c.id)}
          // onChange={(ids) => {
          //   const newSelected = categories.filter((cat) => ids.includes(cat.id));
          //   onCategoriesChange(newSelected);
          // }}
          onChange={(ids) => {
            const newSelected = categories.filter((cat) => ids.includes(cat.id));
            setFormValues({ selectedCategories: newSelected }); // update form
            onCategoriesChange(newSelected); // update store if needed
          }}
          placeholder='اختر فئة أو أكثر'
          leftSection={<Users size={16} />}
          clearable
          searchable
          multiple
          disabled={isDisabled}
          classNames={{
            input: 'placeholder:text-sm! text-primary! font-normal!',
          }}
        />

        {/* Table of selected categories */}
        {selectedCategories.length > 0 && (
          <ScrollArea mih={150} mt={10}>
            <Table
              striped
              highlightOnHover
              withColumnBorders
              className='border border-gray-200 rounded-md'
            >
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2 font-medium text-gray-700 text-sm text-start'>الفئة</th>
                  <th className='px-4 py-2 font-medium text-gray-700 text-sm text-center'>
                    عدد الأفراد
                  </th>
                  <th className='px-4 py-2 font-medium text-gray-700 text-sm text-center'>الحصة</th>
                </tr>
              </thead>

              <tbody>
                {selectedCategories.map((cat) => (
                  <tr key={cat.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 text-gray-800 text-sm'>{cat.label}</td>
                    <td className='px-4 py-2 text-center'>
                      <Badge size='sm' className='bg-blue-100 px-3 py-1 text-blue-700'>
                        {cat.max ? `${cat.min}-${cat.max}` : `${cat.min}+`}
                      </Badge>
                    </td>
                    <td className='px-4 py-2 text-center'>
                      <NumberInput
                        value={cat.portion || 1}
                        min={1}
                        size='xs'
                        onChange={(val) =>
                          val !== null && updateCategoryPortion(cat.id, Number(val))
                        }
                        disabled={isDisabled}
                        className='mx-auto w-20'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>

      <CategoryManagementModal
        opened={managementOpened}
        onClose={closeManagement}
        categories={categories}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        addOrEditCategory={addOrEditCategory}
        deleteCategory={(id) => onCategoriesChange(selectedCategories.filter((c) => c.id !== id))}
        resetToDefault={() => {
          setAllCategories(DEFAULT_CATEGORIES);
          onCategoriesChange(DEFAULT_CATEGORIES);
        }}
      />
    </Stack>
  );
}
