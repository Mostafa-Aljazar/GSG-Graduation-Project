'use client';

import {
  Group,
  LoadingOverlay,
  Pagination,
  Table,
  Text,
  ScrollArea,
  Center,
  Stack,
  ThemeIcon,
  NumberInput,
  Flex,
  Button,
} from '@mantine/core';
import { parseAsInteger, parseAsStringEnum, parseAsString, useQueryStates } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import { Users } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { getDelegates } from '@/actions/actor/general/delegates/getDelegates';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  IDelegate,
  IDelegatesResponse,
} from '@/types/actor/general/delegates/delegates-response.type';
import { getDelegatesByIds } from '@/actions/actor/general/delegates/getDelegatesByIds';
import { ISelectedDelegatePortion } from '@/types/actor/common/aids-management/aids-management.types';
import { DISTRIBUTION_MECHANISM, QUANTITY_AVAILABILITY } from '@/types/actor/common/index.type';
import { useAidStore } from '@/stores/Aid.store';
import { AidStep } from '../../add/add-aid-editor';

// interface CommonAidDelegatesTableProps {
//   destination: DESTINATION_AID;
//   selectedDelegatesPortions: SelectedDelegatePortion[];
//   setSelectedDelegatesPortions: React.Dispatch<React.SetStateAction<SelectedDelegatePortion[]>>;
//   aid_Data?: Aid;
//   aid_Id?: number;
// }

interface Props {
  handelActiveStep: ({ step }: { step: AidStep }) => void;
}

export default function CommonAidDelegatesTable({ handelActiveStep }: Props) {
  /** ==============================
   *  URL State
   *  ============================== */

  const {
    formValues,
    selectedDelegatesPortions: STORE_selectedDelegatesPortions,
    setSelectedDelegatesPortions: STORE_setSelectedDelegatesPortions,
  } = useAidStore();

  const [selectedDelegatesPortions, setSelectedDelegatesPortions] = useState<
    ISelectedDelegatePortion[]
  >([]);

  const [query, setQuery] = useQueryStates({
    delegate_page: parseAsInteger.withDefault(1),
    action: parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.ADD
    ),
    aidId: parseAsString.withDefault(''),
  });

  useEffect(() => {
    if (
      query.action === ACTION_ADD_EDIT_DISPLAY.EDIT &&
      query.aidId !== '' &&
      STORE_selectedDelegatesPortions
    ) {
      startTransition(() => {
        setSelectedDelegatesPortions(STORE_selectedDelegatesPortions);
      });
    }
  }, [STORE_selectedDelegatesPortions, query.action, query.aidId]);

  /** ==============================
   *  Sync portions on mode change
   *  ============================== */
  // useEffect(() => {
  //   if (query.delegatesPortions === DELEGATE_PORTIONS.MANUAL) {
  //     setSelectedDelegatesPortions((prev) =>
  //       prev.map((item) => ({
  //         delegate_Id: item.delegate_Id,
  //         portion: item.portion || 0,
  //       }))
  //     );
  //   } else if (query.delegatesPortions === DELEGATE_PORTIONS.EQUAL) {
  //     setSelectedDelegatesPortions((prev) =>
  //       prev.map((item) => ({
  //         delegate_Id: item.delegate_Id,
  //         portion: query.delegateSinglePortion,
  //       }))
  //     );
  //   }
  // }, [query.delegatesPortions, query.delegateSinglePortion, setSelectedDelegatesPortions]);

  /** ==============================
   *  Local State
   *  ============================== */
  // const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const currentPage = query.delegate_page || 1;
  const limit = 7;
  const offset = (currentPage - 1) * limit;

  /** ==============================
   *  Queries
   *  ============================== */
  const {
    data: addDelegatesData,
    isLoading: isLoadingRegular,
    error: queryError,
  } = useQuery<IDelegatesResponse, Error>({
    queryKey: ['delegates', query],
    queryFn: () => getDelegates({ page: currentPage, limit }),
    retry: 1,
    enabled: query.action !== ACTION_ADD_EDIT_DISPLAY.DISPLAY,
  });

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
    enabled: query.action == ACTION_ADD_EDIT_DISPLAY.DISPLAY,
  });

  // const {
  //   data: allDelegatesIds,
  //   isLoading: isLoadingAll,
  //   error: allQueryError,
  // } = useQuery<number[]>({
  //   queryKey: ['delegates_all', query],
  //   queryFn: async () => (await getDelegatesIds()).delegatesIds,
  //   retry: 1,
  //   staleTime: 1000 * 60 * 5,
  // });

  /** ==============================
   *  Derived Data
   *  ============================== */

  const delegatesData =
    query.action == ACTION_ADD_EDIT_DISPLAY.EDIT || query.action == ACTION_ADD_EDIT_DISPLAY.ADD
      ? addDelegatesData
      : specificDelegatesDataById;

  const isLoading = isLoadingRegular || isLoadingDelegatesIds;

  const error = queryError || queryErrorDelegatesIds;

  const totalSelectedPortion = useMemo(
    () => selectedDelegatesPortions.reduce((sum, cur) => sum + cur.portion, 0),
    [selectedDelegatesPortions]
  );

  // const remainQ = formValues.existingQuantity - totalSelectedPortion;

  /** ==============================
   *  Helpers
   *  ============================== */
  // const selectedDelegatesSet = useMemo(() => new Set(selectedDelegatesIds), [selectedDelegatesIds]);

  // const isRowSelected = useCallback(
  //   (id: number) => selectedDelegatesSet.has(id),
  //   [selectedDelegatesSet]
  // );

  // const handleRowSelection = useCallback(
  //   (id: number, checked: boolean) => {
  //     setSelectedDelegatesPortions((prev) => {
  //       if (checked) {
  //         if (query.delegateSinglePortion <= remainQ) {
  //           return [
  //             ...prev.filter((row) => row.delegate_Id !== id),
  //             { delegate_Id: id, portion: query.delegateSinglePortion },
  //           ];
  //         }
  //         notifications.show({
  //           title: 'خطأ',
  //           message: 'الكمية المتبقية اقل من حصة المندوب',
  //           color: 'red',
  //           position: 'top-left',
  //           withBorder: true,
  //         });
  //         return prev;
  //       } else {
  //         return prev.filter((d) => d.delegate_Id !== id);
  //       }
  //     });
  //     setSelectAllAcrossPages(false);
  //   },
  //   [remainQ, query.delegateSinglePortion, setSelectedDelegatesPortions]
  // );

  /** ==============================
   *  Select All Logic
   *  ============================== */

  const handlePortionChange = useCallback(
    ({ delegateId, value }: { delegateId: string; value: number }) => {
      const changeSelectedDelegatesPortions = (): ISelectedDelegatePortion[] => {
        const prev: ISelectedDelegatePortion[] = selectedDelegatesPortions;
        if (value === 0) {
          return prev.filter((item) => item.delegateId !== delegateId);
        }

        const currentPortion = prev.find((item) => item.delegateId === delegateId)?.portion || 0;
        const totalWithoutThis = totalSelectedPortion - currentPortion;
        const newTotal = totalWithoutThis + value;

        if (
          formValues.quantityAvailability == QUANTITY_AVAILABILITY.LIMITED &&
          newTotal > Number(formValues?.existingQuantity)
        ) {
          notifications.show({
            title: 'خطأ',
            message: 'القيمة المدخلة تتجاوز الكمية المتبقية',
            color: 'red',
            position: 'top-left',
            withBorder: true,
          });
          return prev.filter((item) => item.delegateId !== delegateId);
        }

        if (prev.some((item) => item.delegateId === delegateId)) {
          return prev.map((item) =>
            item.delegateId === delegateId ? { ...item, portion: value } : item
          );
        }

        return [...prev, { delegateId, portion: value }];
      };

      setSelectedDelegatesPortions(changeSelectedDelegatesPortions());
    },
    [setSelectedDelegatesPortions, selectedDelegatesPortions, formValues, totalSelectedPortion]
  );

  /** ==============================
   *  Table Header (Memoized)
   *  ============================== */
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
        <Table.Th px={5} ta='center'>
          عدد الأُسر
        </Table.Th>
        <Table.Th px={5} ta='center'>
          رقم الجوال
        </Table.Th>
        <Table.Th px={5} ta='center'>
          عدد الخيام
        </Table.Th>
        <Table.Th px={5} ta='center'>
          حصص المناديب
        </Table.Th>
      </Table.Tr>
    ),
    []
  );

  /** ==============================
   *  Table Row Component
   *  ============================== */

  const disableInput = query.action == ACTION_ADD_EDIT_DISPLAY.DISPLAY;

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
        <Table.Td px={5} ta='center'>
          {delegate.familyNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.mobileNumber}
        </Table.Td>
        <Table.Td px={5} ta='center'>
          {delegate.tentsNumber}
        </Table.Td>
        <Table.Th px={5} ta='center'>
          <NumberInput
            placeholder='ادخل الحصة...'
            size='sm'
            w='100%'
            classNames={{
              input:
                'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
            }}
            value={
              query.action !== ACTION_ADD_EDIT_DISPLAY.ADD
                ? selectedDelegatesPortions.find((p) => p.delegateId === delegate.id)?.portion
                : 0
            }
            allowDecimal={false}
            disabled={disableInput}
            onChange={(val) =>
              handlePortionChange({ delegateId: delegate.id, value: Number(val) || 0 })
            }
            min={0}
          />
        </Table.Th>
      </Table.Tr>
    );
  });

  TableRow.displayName = 'TableRow';

  /** ==============================
   *  Rows (Memoized)
   *  ============================== */
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

  /////////////////////////

  const handleNext = ({ toNext }: { toNext: boolean }) => {
    if (toNext && formValues.distributionMechanism == DISTRIBUTION_MECHANISM.DELEGATES_LISTS) {
      STORE_setSelectedDelegatesPortions(selectedDelegatesPortions);
      handelActiveStep({ step: AidStep.AID_DISPLACEDS });
    } else {
      setSelectedDelegatesPortions([]);
      handelActiveStep({ step: AidStep.AID_FORM });
    }
  };

  /////////////////////////
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

      {(delegatesData?.pagination.totalPages ?? 0) > 1 && (
        <Flex justify='center'>
          <Pagination
            value={query.delegate_page}
            onChange={(page) => setQuery((prev) => ({ ...prev, delegate_page: page }))}
            total={delegatesData?.pagination.totalPages ?? 0}
            pt={30}
            size='sm'
            mx='auto'
            radius='xl'
            withControls={false}
          />
        </Flex>
      )}

      <Group justify='space-between'>
        <Button type='submit' size='md' w={100} onClick={() => handleNext({ toNext: false })}>
          السابق
        </Button>
        <Button type='submit' size='md' w={100} onClick={() => handleNext({ toNext: true })}>
          التالي
        </Button>
      </Group>
    </>
  );
}
