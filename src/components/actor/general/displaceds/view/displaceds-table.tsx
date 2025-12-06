'use client';

import {
  Checkbox,
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  Text,
  Loader,
  ActionIcon,
  Center,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import { ListChecks, ListX, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDisplaceds } from '../context/displaceds-context';
import { getDisplaceds } from '@/actions/actor/general/displaceds/getDisplaceds';
import { IDisplacedsResponse } from '@/types/actor/general/displaceds/displaces-response.type';
import { getDisplacedsIds } from '@/actions/actor/general/displaceds/getDisplacedsIds';
import DisplacedTableActions from '../displaceds-table-actions';

export default function DisplacedsTable() {
  const { localFilters, setDisplacedNum } = useDisplaceds();

  const [selectedDisplacedIds, setSelectedDisplacedIds] = useState<number[]>([]);
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const [query, setQuery] = useQueryStates(
    { displaced_page: parseAsInteger.withDefault(1), search: parseAsString.withDefault('') },
    { shallow: true }
  );

  const currentPage = query.displaced_page || 1;
  const limit = 7;
  const offset = (currentPage - 1) * limit;

  const {
    data: displacedData,
    isLoading: isLoadingRegular,
    error: queryError,
  } = useQuery<IDisplacedsResponse, Error>({
    queryKey: ['displaceds', query.search, localFilters, currentPage],
    queryFn: () =>
      getDisplaceds({
        page: currentPage,
        limit,
        search: query.search,
        filters: localFilters,
      }),
  });

  const {
    data: allDisplacedIDs,
    isLoading: isLoadingAll,
    error: allQueryError,
  } = useQuery<number[], Error>({
    queryKey: ['displaceds_all', query.search, localFilters],
    queryFn: async () => (await getDisplacedsIds({ filters: localFilters })).displacedsIds,
    enabled: selectAllAcrossPages,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingRegular || isLoadingAll;
  const error = allQueryError || queryError;

  useEffect(() => {
    setDisplacedNum(displacedData?.pagination?.totalItems || 0);
  }, [displacedData, setDisplacedNum]);

  useEffect(() => {
    if (allDisplacedIDs && selectAllAcrossPages) {
      startTransition(() => {
        setSelectedDisplacedIds(allDisplacedIDs);
      });
    }
  }, [allDisplacedIDs, selectAllAcrossPages]);

  const isRowSelected = useCallback(
    (id: number) => selectedDisplacedIds.includes(id),
    [selectedDisplacedIds]
  );

  const areAllPagesRowsSelected = useCallback(
    () => selectedDisplacedIds.length === (displacedData?.pagination?.totalItems || 0),
    [selectedDisplacedIds, displacedData]
  );

  const handleRowSelection = useCallback(
    (id: number, checked: boolean) => {
      setSelectedDisplacedIds((prev) => {
        const updated = checked
          ? [...prev.filter((rowId) => rowId !== id), id]
          : prev.filter((rowId) => rowId !== id);
        setSelectAllAcrossPages(updated.length === (displacedData?.pagination?.totalItems || 0));
        return updated;
      });
    },
    [displacedData]
  );

  const handleSelectAllAcrossAllPages = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectAllAcrossPages(true);
        setSelectedDisplacedIds(allDisplacedIDs || []);
      } else {
        setSelectAllAcrossPages(false);
        setSelectedDisplacedIds([]);
      }
    },
    [allDisplacedIDs]
  );

  const columns = useMemo(
    () => (
      <Table.Tr>
        <Table.Th px={5} ta='center' style={{ width: 40 }}>
          <ActionIcon
            variant='light'
            aria-label='Select all rows across all pages'
            disabled={!displacedData?.displaceds?.length}
            onClick={() => handleSelectAllAcrossAllPages(!areAllPagesRowsSelected())}
          >
            {areAllPagesRowsSelected() ? <ListX size={18} /> : <ListChecks size={18} />}
          </ActionIcon>
        </Table.Th>
        <Table.Th px={5} ta='center'>
          #
        </Table.Th>
        <Table.Th px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
          اسم النازح
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الهوية
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الخيمة
        </Table.Th>
        <Table.Th px={5} ta='center'>
          عدد الأفراد
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الجوال
        </Table.Th>
        <Table.Th px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
          اسم المندوب
        </Table.Th>
        <Table.Th px={5} ta='center'>
          الإجراءات
        </Table.Th>
      </Table.Tr>
    ),
    [displacedData, handleSelectAllAcrossAllPages, areAllPagesRowsSelected]
  );

  const rows = useMemo(() => {
    return (displacedData?.displaceds || []).map((element, index) => (
      <Table.Tr
        key={element.id}
        bg={isRowSelected(element.id) ? 'var(--mantine-color-blue-light)' : undefined}
      >
        <Table.Td px={5} ta='center'>
          <Checkbox
            aria-label='Select row'
            checked={isRowSelected(element.id)}
            onChange={(e) => handleRowSelection(element.id, e.currentTarget.checked)}
          />
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {offset + index + 1}
        </Table.Td>
        <Table.Td px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
          {element.name}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {element.identity}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {element.tent}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {element.familyNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {element.mobileNumber}
        </Table.Td>
        <Table.Td px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
          {element.delegate.name}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          <DisplacedTableActions displacedId={element.id} />
        </Table.Td>
      </Table.Tr>
    ));
  }, [displacedData, handleRowSelection, offset, isRowSelected]);

  const noDisplaceds = useMemo(
    () => (
      <Table.Tr>
        <Table.Td colSpan={9}>
          <Center w='100%' py={30}>
            <Stack align='center' gap={8}>
              <ThemeIcon variant='light' radius='xl' size={50} color='gray'>
                <Users size={25} />
              </ThemeIcon>
              <Text ta='center' c='dimmed' fw={500} size='md'>
                لا توجد بيانات للنازحين
              </Text>
            </Stack>
          </Center>
        </Table.Td>
      </Table.Tr>
    ),
    []
  );

  return (
    <>
      {selectedDisplacedIds.length > 0 && (
        <Group justify='space-between' align='center' wrap='nowrap'>
          <Group flex={1}>
            {selectAllAcrossPages ? (
              <Text size='md' fw={500} style={{ whiteSpace: 'nowrap' }}>
                تم تحديد جميع العناصر عبر جميع الصفحات
                {isLoadingAll && <Loader size='xs' ml={5} />}
                {allQueryError && ` (خطأ: ${allQueryError.message})`}
              </Text>
            ) : (
              <Text size='md' fw={500}>
                تم تحديد {selectedDisplacedIds.length} عنصر
              </Text>
            )}
          </Group>
          <Group justify='flex-end' flex={1}>
            <DisplacedTableActions displacedIds={selectedDisplacedIds} />
          </Group>
        </Group>
      )}

      <Table.ScrollContainer
        minWidth='100%'
        pos='relative'
        className={cn(isLoading && 'min-h-[300px]!')}
      >
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />
        {error && (
          <Text fw={500} size='sm' ta='center' c='red'>
            {error.message}
          </Text>
        )}
        <Table horizontalSpacing='xs' striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>{columns}</Table.Thead>
          <Table.Tbody>{rows.length === 0 ? noDisplaceds : rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination
        value={currentPage}
        onChange={(page) => setQuery((prev) => ({ ...prev, displaced_page: page }))}
        total={displacedData?.pagination?.totalPages || 0}
        pt={30}
        size='sm'
        mx='auto'
        radius='xl'
        withControls={false}
        classNames={{ dots: '!rounded-full !text-gray-300 border-1', control: '!rounded-full' }}
      />
    </>
  );
}
