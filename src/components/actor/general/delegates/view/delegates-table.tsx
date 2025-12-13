'use client';
import { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import {
  ActionIcon,
  Center,
  Checkbox,
  Group,
  Loader,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/utils/cn';
import { ListChecks, ListX, Users } from 'lucide-react';
import { getDelegates } from '@/actions/actor/general/delegates/getDelegates';
import { IDelegatesResponse } from '@/types/actor/general/delegates/delegates-response.type';
import { getDelegatesIds } from '@/actions/actor/general/delegates/getDelegatesIds';
import DelegatesTableActions from '../delegates-table-actions';

export default function DelegatesTable() {
  const [query, setQuery] = useQueryStates(
    { delegate_page: parseAsInteger.withDefault(1) },
    { shallow: true }
  );

  const [selectedDelegateIds, setSelectedDelegateIds] = useState<string[]>([]);
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const currentPage = query.delegate_page || 1;
  const limit = 7;
  const offset = (currentPage - 1) * limit;

  const {
    data: delegatesData,
    isLoading: isLoadingRegular,
    error: queryError,
  } = useQuery<IDelegatesResponse, Error>({
    queryKey: ['delegates', query],
    queryFn: () => getDelegates({ page: query.delegate_page, limit }),
    retry: 1,
  });

  const {
    data: allDelegatesIDs,
    isLoading: isLoadingAll,
    error: allQueryError,
  } = useQuery<string[], Error>({
    queryKey: ['delegates_all'],
    queryFn: async () => (await getDelegatesIds()).delegatesIds,
    enabled: selectAllAcrossPages,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingAll || isLoadingRegular;
  const error = allQueryError || queryError;

  // Sync selected IDs when selectAllAcrossPages changes
  useEffect(() => {
    if (allDelegatesIDs && selectAllAcrossPages) {
      startTransition(() => {
        setSelectedDelegateIds(allDelegatesIDs);
      });
    }
  }, [allDelegatesIDs, selectAllAcrossPages]);

  const handleRowSelection = useCallback(
    (id: string, checked: boolean) => {
      setSelectedDelegateIds((prev) => {
        const updated = checked
          ? [...prev.filter((x) => x !== id), id]
          : prev.filter((x) => x !== id);
        if (
          delegatesData?.pagination?.totalItems &&
          updated.length === delegatesData.pagination.totalItems
        ) {
          setSelectAllAcrossPages(true);
        } else {
          setSelectAllAcrossPages(false);
        }
        return updated;
      });
    },
    [delegatesData]
  );

  const handleSelectAllAcrossAllPages = useCallback(() => {
    if (!selectAllAcrossPages) {
      setSelectAllAcrossPages(true);
      setSelectedDelegateIds(allDelegatesIDs || []);
    } else {
      setSelectAllAcrossPages(false);
      setSelectedDelegateIds([]);
    }
  }, [selectAllAcrossPages, allDelegatesIDs]);

  const columns = useMemo(
    () => (
      <Table.Tr>
        <Table.Th px={5} ta='center' style={{ width: 40 }}>
          <ActionIcon
            variant='light'
            aria-label='Select all rows across all pages'
            disabled={!delegatesData?.delegates?.length}
            onClick={handleSelectAllAcrossAllPages}
          >
            {selectedDelegateIds.length === (delegatesData?.pagination?.totalItems || 0) ? (
              <ListX size={18} />
            ) : (
              <ListChecks size={18} />
            )}
          </ActionIcon>
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content'>
          #
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          اسم المندوب
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          رقم الهوية
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          عدد النازحين
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          عدد العائلات
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          عدد الخيام
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          رقم الجوال
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          الإجراءات
        </Table.Th>
      </Table.Tr>
    ),
    [delegatesData, selectedDelegateIds.length, handleSelectAllAcrossAllPages]
  );

  const rows = useMemo(
    () =>
      (delegatesData?.delegates || []).map((element, index) => (
        <Table.Tr
          key={element.id}
          bg={
            selectedDelegateIds.includes(element.id) ? 'var(--mantine-color-blue-light)' : undefined
          }
        >
          <Table.Td px={5} ta='center'>
            <Checkbox
              aria-label='Select row'
              checked={selectedDelegateIds.includes(element.id)}
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
            {element.displacedNumber}
          </Table.Td>
          <Table.Td px={5} ta='center'>
            {element.familyNumber}
          </Table.Td>
          <Table.Td px={5} ta='center'>
            {element.tentsNumber}
          </Table.Td>
          <Table.Td px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
            {element.mobileNumber}
          </Table.Td>
          <Table.Td px={5} ta='center'>
            <DelegatesTableActions delegateId={element.id} />
          </Table.Td>
        </Table.Tr>
      )),
    [delegatesData, selectedDelegateIds, offset, handleRowSelection]
  );

  const noDelegates = useMemo(
    () => (
      <Table.Tr>
        <Table.Td colSpan={9}>
          <Center w='100%' py={30}>
            <Stack align='center' gap={8}>
              <ThemeIcon variant='light' radius='xl' size={50} color='gray'>
                <Users size={25} />
              </ThemeIcon>
              <Text ta='center' c='dimmed' fw={500} size='md'>
                لا توجد بيانات للمناديب
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
      {selectedDelegateIds.length > 0 && (
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
                تم تحديد {selectedDelegateIds.length} عنصر
              </Text>
            )}
          </Group>
          <Group justify='flex-end' flex={1}>
            <DelegatesTableActions delegateIds={selectedDelegateIds} />
          </Group>
        </Group>
      )}

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

        <Table horizontalSpacing='xs' striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>{columns}</Table.Thead>
          <Table.Tbody>{rows.length === 0 ? noDelegates : rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination
        value={currentPage}
        onChange={(page) => setQuery((prev) => ({ ...prev, delegate_page: page }))}
        total={delegatesData?.pagination?.totalPages || 0}
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
    </>
  );
}
