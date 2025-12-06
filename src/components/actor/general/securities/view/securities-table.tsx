'use client';

import { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import {
  ActionIcon,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { ListChecks, ListX, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import useAuth from '@/hooks/useAuth';
import { getSecurities } from '@/actions/actor/general/security-data/getSecurities';
import { ISecuritiesResponse } from '@/types/actor/general/securities/securities-response.types';
import { getSecuritiesIds } from '@/actions/actor/general/security-data/getSecuritiesIds';
import { USER_RANK_LABELS } from '@/constants/user-types';
import SecuritiesTableActions from '../securities-table-actions';

export default function SecuritiesTable() {
  const { isManager, isSecurityOfficer } = useAuth();

  const [query, setQuery] = useQueryStates(
    { security_page: parseAsInteger.withDefault(1) },
    { shallow: true }
  );

  const [selectedSecurityIds, setSelectedSecurityIds] = useState<number[]>([]);
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const currentPage = query.security_page || 1;
  const limit = 7;
  const offset = (currentPage - 1) * limit;

  const {
    data: securityData,
    isLoading: isLoadingRegular,
    error: queryError,
  } = useQuery<ISecuritiesResponse, Error>({
    queryKey: ['securities', query],
    queryFn: () => getSecurities({ page: query.security_page, limit }),
    retry: 1,
  });

  const {
    data: allSecurityIds,
    isLoading: isLoadingAll,
    error: allQueryError,
  } = useQuery<number[], Error>({
    queryKey: ['securities_all'],
    queryFn: async () => (await getSecuritiesIds()).securitiesIds,
    enabled: selectAllAcrossPages,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingRegular || isLoadingAll;
  const error = allQueryError || queryError;

  useEffect(() => {
    if (allSecurityIds && selectAllAcrossPages) {
      startTransition(() => setSelectedSecurityIds(allSecurityIds));
    }
  }, [allSecurityIds, selectAllAcrossPages]);

  const isRowSelected = useCallback(
    (id: number) => selectedSecurityIds.includes(id),
    [selectedSecurityIds]
  );

  const areAllPagesRowsSelected = useMemo(
    () => selectedSecurityIds.length === (securityData?.pagination?.totalItems || 0),
    [selectedSecurityIds, securityData?.pagination?.totalItems]
  );

  const handleRowSelection = useCallback(
    (id: number, checked: boolean) => {
      setSelectedSecurityIds((prev) => {
        const updated = checked
          ? [...prev.filter((x) => x !== id), id]
          : prev.filter((x) => x !== id);
        setSelectAllAcrossPages(updated.length === (securityData?.pagination?.totalItems || 0));
        return updated;
      });
    },
    [securityData]
  );

  const handleSelectAllAcrossPages = useCallback(() => {
    if (!selectAllAcrossPages) {
      setSelectAllAcrossPages(true);
      setSelectedSecurityIds(allSecurityIds || []);
    } else {
      setSelectAllAcrossPages(false);
      setSelectedSecurityIds([]);
    }
  }, [selectAllAcrossPages, allSecurityIds]);

  const columns = useMemo(
    () => (
      <Table.Tr>
        <Table.Th px={5} ta='center' style={{ width: 40 }}>
          <ActionIcon
            variant='light'
            aria-label='Select all rows across all pages'
            disabled={!securityData?.securities?.length}
            onClick={handleSelectAllAcrossPages}
          >
            {areAllPagesRowsSelected ? <ListX size={18} /> : <ListChecks size={18} />}
          </ActionIcon>
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content'>
          #
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          الاسم
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          رقم الهوية
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          رقم الجوال
        </Table.Th>
        <Table.Th px={5} ta='center' w='fit-content' style={{ whiteSpace: 'nowrap' }}>
          الرتبة
        </Table.Th>
        {(isManager || isSecurityOfficer) && (
          <Table.Th px={5} ta='center'>
            الإجراءات
          </Table.Th>
        )}
      </Table.Tr>
    ),
    [
      securityData,
      areAllPagesRowsSelected,
      handleSelectAllAcrossPages,
      isManager,
      isSecurityOfficer,
    ]
  );

  const rows = useMemo(() => {
    return (securityData?.securities || []).map((sec, index) => (
      <Table.Tr
        key={sec.id}
        bg={isRowSelected(sec.id) ? 'var(--mantine-color-blue-light)' : undefined}
      >
        <Table.Td px={5} ta='center'>
          <Checkbox
            checked={isRowSelected(sec.id)}
            onChange={(e) => handleRowSelection(sec.id, e.currentTarget.checked)}
          />
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {offset + index + 1}
        </Table.Td>
        <Table.Td px={5} ta='center' style={{ whiteSpace: 'nowrap' }}>
          {sec.name}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {sec.identity}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {sec.mobileNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {USER_RANK_LABELS[sec.rank]}
        </Table.Td>
        {(isManager || isSecurityOfficer) && (
          <Table.Td px={5} ta='center'>
            <SecuritiesTableActions securityId={sec.id} />
          </Table.Td>
        )}
      </Table.Tr>
    ));
  }, [securityData, offset, handleRowSelection, isRowSelected, isManager, isSecurityOfficer]);

  const noSecurities = useMemo(
    () => (
      <Table.Tr>
        <Table.Td colSpan={7}>
          <Center w='100%' py={30}>
            <Stack align='center' gap={8}>
              <ThemeIcon variant='light' radius='xl' size={50} color='gray'>
                <Users size={25} />
              </ThemeIcon>
              <Text ta='center' c='dimmed' fw={500} size='md'>
                لا توجد بيانات للأمن
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
      {selectedSecurityIds.length > 0 && (
        <Group justify='space-between' align='center' wrap='nowrap'>
          <Group flex={1}>
            <Text size='md' fw={500} style={{ whiteSpace: 'nowrap' }}>
              {selectAllAcrossPages
                ? `تم تحديد جميع العناصر عبر جميع الصفحات${isLoadingAll ? '...' : ''}${
                    allQueryError ? ` (خطأ: ${allQueryError.message})` : ''
                  }`
                : `تم تحديد ${selectedSecurityIds.length} عنصر`}
            </Text>
          </Group>
          <Group justify='flex-end' flex={1}>
            <SecuritiesTableActions securityIds={selectedSecurityIds} />
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
          <Table.Tbody>{rows.length === 0 ? noSecurities : rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination
        value={currentPage}
        onChange={(page) => setQuery((prev) => ({ ...prev, security_page: page }))}
        total={securityData?.pagination?.totalPages || 0}
        pt={30}
        size='sm'
        mx='auto'
        radius='xl'
        withControls={false}
        classNames={{ dots: 'rounded-full! text-gray-300! border-1!', control: 'rounded-full!' }}
      />
    </>
  );
}
