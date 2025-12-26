'use client';

import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { startTransition, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { notifications } from '@mantine/notifications';
import { ListChecks, ListX } from 'lucide-react';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';
import { IDisplacedsResponse } from '@/types/actor/general/displaceds/displaces-response.type';
import { useDisplaceds } from '@/components/actor/general/displaceds/context/displaceds-context';
import { getDisplaceds } from '@/actions/actor/general/displaceds/getDisplaceds';
import { getDisplacedsIds } from '@/actions/actor/general/displaceds/getDisplacedsIds';
import { useAidStore } from '@/stores/Aid.store';
import { AidStep } from '../../add/add-aid-editor';
import { DISTRIBUTION_MECHANISM } from '@/types/actor/common/index.type';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';

interface Props {
  handelActiveStep: ({ step }: { step: AidStep }) => void;
  handleSubmit: () => void; // added
}

export default function AidAddDisplacedsTable({ handelActiveStep, handleSubmit }: Props) {
  const [query, setQuery] = useQueryStates(
    {
      displaced_page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(''),
      action: parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
        ACTION_ADD_EDIT_DISPLAY.ADD
      ),
      aidId: parseAsString.withDefault(''),
    },
    { shallow: true }
  );

  const { userType: role, userId } = useAlreadyUserStore();
  const {
    formValues: STORE_formValues,
    selectedDelegatesPortions,
    selectedDisplacedIds: STORE_selectedDisplacedIds,
    setSelectedDisplacedIds: STORE_setSelectedDisplacedIds,
  } = useAidStore();

  const [selectedDisplacedIds, setSelectedDisplacedIds] = useState<string[]>(
    STORE_selectedDisplacedIds || []
  );

  useEffect(() => {
    if (
      query.action === ACTION_ADD_EDIT_DISPLAY.EDIT &&
      query.aidId !== '' &&
      STORE_selectedDisplacedIds
    ) {
      startTransition(() => {
        setSelectedDisplacedIds(STORE_selectedDisplacedIds);
      });
    }
  }, [STORE_selectedDisplacedIds, query.action, query.aidId]);

  // Sync local selection to the global aid store whenever it changes so other
  // components/readers always see the latest selection without relying on "Save".
  useEffect(() => {
    STORE_setSelectedDisplacedIds(selectedDisplacedIds);
  }, [selectedDisplacedIds, STORE_setSelectedDisplacedIds]);

  const { localFilters, setDisplacedNum } = useDisplaceds();

  const limitSelectedDisplaced =
    role == USER_TYPE.DELEGATE
      ? selectedDelegatesPortions?.find((item) => item.delegateId == userId)?.portion ?? 0
      : -1;

  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const currentPage = query.displaced_page || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const {
    data: addDisplacedData,
    isLoading: isLoadingRegular,
    error: queryError,
  } = useQuery<IDisplacedsResponse, Error>({
    queryKey: ['displaceds', query, localFilters],
    queryFn: () =>
      getDisplaceds({
        page: currentPage,
        limit: limit,
        search: query.search,
        filters: {
          ...localFilters,
          delegate: role == USER_TYPE.DELEGATE ? [userId.toString()] : [],
        },
      }),
    retry: 1,
  });

  const {
    data: allDisplacedIds,
    isLoading: isLoadingAll,
    error: allQueryError,
  } = useQuery<string[], Error>({
    queryKey: ['displaceds_all', query.search, localFilters],
    queryFn: async () => {
      const response = await getDisplacedsIds({
        filters: localFilters,
      });
      return response.displacedsIds;
    },
    enabled: selectAllAcrossPages,
    retry: 1,
  });

  const displacedData = addDisplacedData;

  const isLoading = isLoadingAll || isLoadingRegular;
  const error = allQueryError || queryError;

  useEffect(() => {
    if (displacedData) {
      setDisplacedNum(displacedData?.pagination?.totalItems || 0);
    }
  }, [displacedData, setDisplacedNum]);

  useEffect(() => {
    if (allDisplacedIds && selectAllAcrossPages) {
      startTransition(() => {
        setSelectedDisplacedIds(allDisplacedIds);
      });
    }
  }, [allDisplacedIds, selectAllAcrossPages, setSelectedDisplacedIds]);

  const isRowSelected = (id: string) => selectedDisplacedIds.includes(id);

  const areAllPagesRowsSelected = () =>
    selectedDisplacedIds.length === (displacedData?.pagination?.totalItems || 0);

  const handleRowSelection = (id: string, checked: boolean) => {
    if (checked) {
      if (role == 'DELEGATE') {
        if (limitSelectedDisplaced > selectedDisplacedIds.length) {
          const changeSelectedDisplacedIds: string[] = [
            ...selectedDisplacedIds.filter((rowId) => rowId !== id),
            id,
          ];

          setSelectedDisplacedIds(changeSelectedDisplacedIds);
          // setSelectedDisplacedIds((prev) => [...prev.filter((rowId) => rowId !== id), id]);
          if (areAllPagesRowsSelected()) setSelectAllAcrossPages(true);
        } else {
          notifications.show({
            title: 'بلغت الحد الأقصى',
            message: `لا يمكن إضافة أكثر من ${limitSelectedDisplaced} نازح`,
            color: 'red',
            position: 'top-left',
            withBorder: true,
          });
        }
      } else {
        const changeSelectedDisplacedIds: string[] = [
          ...selectedDisplacedIds.filter((rowId) => rowId !== id),
          id,
        ];

        setSelectedDisplacedIds(changeSelectedDisplacedIds);
        if (areAllPagesRowsSelected()) setSelectAllAcrossPages(true);
      }
    } else {
      const changeSelectedDisplacedIds: string[] = selectedDisplacedIds.filter(
        (rowId) => rowId !== id
      );
      setSelectedDisplacedIds(changeSelectedDisplacedIds);
      // setSelectedDisplacedIds((prev) => prev.filter((rowId) => rowId !== id));
      setSelectAllAcrossPages(false);
    }
  };

  const handleSelectAllAcrossAllPages = (checked: boolean) => {
    if (checked) {
      if (role == 'DELEGATE') {
        if (limitSelectedDisplaced > (allDisplacedIds?.length ?? 0)) {
          setSelectAllAcrossPages(true);
          setSelectedDisplacedIds(allDisplacedIds || []);
        } else {
          notifications.show({
            title: 'بلغت الحد الأقصى',
            message: `لا يمكن إضافة أكثر من ${limitSelectedDisplaced} نازح`,
            color: 'red',
            position: 'top-left',
            withBorder: true,
          });
        }
      } else {
        setSelectAllAcrossPages(true);
        setSelectedDisplacedIds(allDisplacedIds || []);
      }
    } else {
      setSelectAllAcrossPages(false);
      setSelectedDisplacedIds([]);
    }
  };

  const headers = (
    <Table.Tr>
      <Table.Th px={5} ta='center' style={{ width: 40 }}>
        <ActionIcon
          variant='light'
          aria-label='Select all rows across all pages'
          onClick={() => handleSelectAllAcrossAllPages(!areAllPagesRowsSelected())}
        >
          {areAllPagesRowsSelected() ? <ListX size={18} /> : <ListChecks size={18} />}
        </ActionIcon>
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content'>
        الرقم
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
        اسم النازح
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
        رقم الهوية
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
        رقم الخيمة
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content'>
        عدد الأفراد
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content'>
        رقم الجوال
      </Table.Th>
      <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
        اسم المندوب
      </Table.Th>
    </Table.Tr>
  );

  const rows = (displacedData?.displaceds || []).map((element, index) => (
    <Table.Tr
      key={element.id}
      bg={isRowSelected(element.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td px={5} ta='center' w='fit-content'>
        <Checkbox
          aria-label='Select row'
          checked={isRowSelected(element.id)}
          onChange={(e) => handleRowSelection(element.id, e.currentTarget.checked)}
        />
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content'>
        {offset + index + 1}
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
        {element.name}
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content'>
        {element.identity}
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content'>
        {element.tent}
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content'>
        {element.familyNumber}
      </Table.Td>
      <Table.Td px={5} ta='center' w='fit-content'>
        {element.mobileNumber}
      </Table.Td>
      <Table.Td px={5} w='fit-content' ta='center' style={{ whiteSpace: 'nowrap' }}>
        {element.delegate.name}
      </Table.Td>
    </Table.Tr>
  ));

  /////////////////////////

  const handleNext = ({ toNext }: { toNext: boolean }) => {
    const toPrev = !toNext;

    STORE_setSelectedDisplacedIds(selectedDisplacedIds);
    if (
      toPrev &&
      STORE_formValues.distributionMechanism == DISTRIBUTION_MECHANISM.DELEGATES_LISTS
    ) {
      handelActiveStep({ step: AidStep.AID_DELEGATES });
    } else if (
      toPrev &&
      STORE_formValues.distributionMechanism == DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES
    ) {
      handelActiveStep({ step: AidStep.AID_FORM });
    } else {
      // handelActiveStep({ step: AidStep.Final });
      handleSubmit();
    }
  };

  /////////////////////////

  return (
    <Stack>
      <Group
        flex={1}
        justify='space-between'
        align='center'
        wrap='nowrap'
        hidden={!selectedDisplacedIds?.length || false}
      >
        {selectedDisplacedIds?.length === 0 ? (
          <Text size='md' fw={500} c='dimmed'>
            لم يتم تحديد أي عنصر
          </Text>
        ) : selectAllAcrossPages ||
          selectedDisplacedIds?.length === displacedData?.pagination?.totalItems ? (
          <Text size='md' fw={500} style={{ whiteSpace: 'nowrap' }}>
            تم تحديد جميع العناصر عبر جميع الصفحات
            {isLoadingAll && ' (جاري تحميل البيانات...)'}
            {allQueryError && ` (خطأ: ${allQueryError.message})`}
          </Text>
        ) : (
          <Text size='md' fw={500}>
            تم تحديد {selectedDisplacedIds.length} عنصر
          </Text>
        )}
      </Group>

      <Table.ScrollContainer
        minWidth='100%'
        w='100%'
        pos='relative'
        className={cn(isLoading && 'min-h-[300px]!')}
      >
        <LoadingOverlay
          visible={isLoading || isLoadingAll}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />

        {error && (
          <Text fw={500} size='sm' ta='center' c='red'>
            {error.message}
          </Text>
        )}

        {!isLoading && (!displacedData?.displaceds || displacedData.displaceds.length === 0) && (
          <Text fw={500} size='sm' ta='center' c='dimmed'>
            لا توجد بيانات للنازحين
          </Text>
        )}

        <Table horizontalSpacing='xs' striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>{headers}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination
        value={query.displaced_page}
        onChange={(page) => setQuery((prev) => ({ ...prev, displaced_page: page }))}
        total={displacedData?.pagination?.totalPages || 0}
        pt={30}
        size='sm'
        mx='auto'
        radius='xl'
        withControls={false}
        classNames={{
          dots: '!rounded-full !text-gray-300 border-1',
          control: '!rounded-full',
        }}
      />

      <Group justify='space-between'>
        <Button type='submit' size='md' w={100} onClick={() => handleNext({ toNext: false })}>
          السابق
        </Button>
        <Button type='submit' size='md' w={100} onClick={() => handleNext({ toNext: true })}>
          حفظ
        </Button>
      </Group>
    </Stack>
  );
}
