'use client';

import {
  LoadingOverlay,
  Pagination,
  Table,
  Text,
  ScrollArea,
  Center,
  Stack,
  ThemeIcon,
  Flex,
} from '@mantine/core';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import {
  IDelegate,
  IDelegatesResponse,
} from '@/types/actor/general/delegates/delegatesResponse.type';
import { getDelegatesByIds } from '@/actions/actor/general/delegates/getDelegatesByIds';
import { ISelectedDelegatePortion } from '@/types/actor/common/aids-management/aids-management.types';

interface IAidDelegatesTableViewProps {
  selectedDelegatesPortions: ISelectedDelegatePortion[];
}

export default function AidDelegatesTableView({
  selectedDelegatesPortions,
}: IAidDelegatesTableViewProps) {
  const [query, setQuery] = useQueryStates({
    delegate_page: parseAsInteger.withDefault(1),
  });

  const currentPage = query.delegate_page || 1;
  const limit = 7;
  const offset = (currentPage - 1) * limit;

  const selectedDelegatesIds = useMemo(
    () => selectedDelegatesPortions.map((res) => res.delegateId),
    [selectedDelegatesPortions]
  );

  const {
    data: specificDelegatesDataById,
    isLoading: isLoadingDelegatesIds,
    error: queryErrorDelegatesIds,
  } = useQuery<IDelegatesResponse>({
    queryKey: ['delegates_by_Ids', query],
    queryFn: () =>
      getDelegatesByIds({
        Ids: selectedDelegatesIds,
        page: currentPage,
        limit,
      }),
    retry: 1,
  });

  const delegatesData = specificDelegatesDataById;

  const isLoading = isLoadingDelegatesIds;

  const error = queryErrorDelegatesIds;

  const columns = useMemo(
    () => (
      <Table.Tr>
        <Table.Th px={5} ta='center'>
          #
        </Table.Th>
        <Table.Th px={5} ta='center'>
          اسم المندوب
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الهوية
        </Table.Th>
        <Table.Th px={5} ta='center'>
          عدد النازحين
        </Table.Th>
        {/* <Table.Th px={5} ta='center'>
          عدد الأُسر
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الجوال
        </Table.Th>
        <Table.Th px={5} ta='center'>
          عدد الخيام
        </Table.Th> */}
        <Table.Th px={5} ta='center'>
          حصص المناديب
        </Table.Th>
      </Table.Tr>
    ),
    []
  );

  const TableRow = React.memo(({ delegate, index }: { delegate: IDelegate; index: number }) => {
    return (
      <Table.Tr key={delegate.id}>
        <Table.Td px={5} ta='center'>
          {offset + index + 1}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.name}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.identity}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.displacedNumber}
        </Table.Td>
        {/* <Table.Td px={5} ta='center'>
          {delegate.familyNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.mobileNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.tentsNumber}
        </Table.Td> */}
        <Table.Th px={5} ta='center'>
          {selectedDelegatesPortions.find((p) => p.delegateId === delegate.id)?.portion}
        </Table.Th>
      </Table.Tr>
    );
  });

  TableRow.displayName = 'TableRow';

  const rows = useMemo(
    () =>
      (delegatesData?.delegates || []).map((delegate, index) => (
        <TableRow key={delegate.id} delegate={delegate} index={index} />
      )),
    [delegatesData, TableRow]
  );

  const noDelegates = (
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
  );

  return (
    <>
      <ScrollArea pos={'relative'}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={49}
          overlayProps={{ radius: 'sm', blur: 0.3 }}
        />

        {error && (
          <Text fw={500} size='sm' ta='center' c='red'>
            {error.message}
          </Text>
        )}

        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1,
            }}
          >
            {columns}
          </Table.Thead>

          <Table.Tbody>{rows.length === 0 ? noDelegates : rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {(delegatesData?.pagination.totalPages as number) > 1 && (
        <Flex justify='center'>
          <Pagination
            value={query.delegate_page}
            onChange={(page) => setQuery((prev) => ({ ...prev, delegate_page: page }))}
            total={delegatesData?.pagination.totalPages as number}
            pt={30}
            size='sm'
            mx='auto'
            radius='xl'
            withControls={false}
          />
        </Flex>
      )}
    </>
  );
}
