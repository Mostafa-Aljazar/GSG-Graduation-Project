'use client';

import {
  ActionIcon,
  Button,
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
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import { IDisplacedsResponse } from '@/types/actor/general/displaceds/displaces-response.type';
import { getDisplaceds } from '@/actions/actor/general/displaceds/getDisplaceds';
import { getDisplacedsIds } from '@/actions/actor/general/displaceds/getDisplacedsIds';
import { ListChecks, ListX, Users } from 'lucide-react';
import { IActionResponse } from '@/types/common/action-response.type';
import {
  addAidDisplaceds,
  IAddAidDisplacedsProps,
} from '@/actions/actor/common/aids-management/addDisplaceds';
import { notifications } from '@mantine/notifications';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';

interface ICommonAidDisplacedsTableProps {
  // setDisplacedNum: React.Dispatch<React.SetStateAction<number>>;
  aidData: TAid;
}

export default function AidAddDisplacedsTable({
  // setDisplacedNum,
  aidData,
}: ICommonAidDisplacedsTableProps) {
  const defaultSelectedDisplacedIds = aidData.selectedDisplacedIds || [];

  const [selectedDisplacedIds, setSelectedDisplacedIds] = useState<string[]>(
    defaultSelectedDisplacedIds
  );
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const [query, setQuery] = useQueryStates(
    {
      displaced_page: parseAsInteger.withDefault(1),
      search: parseAsString.withDefault(''),
    },
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
    queryKey: ['displaceds', query, currentPage],
    queryFn: () =>
      getDisplaceds({
        page: currentPage,
        limit,
        search: query.search,
      }),
  });

  const {
    data: allDisplacedIDs,
    isLoading: isLoadingAll,
    error: allQueryError,
  } = useQuery<string[], Error>({
    queryKey: ['displaceds_all', query.search],
    queryFn: async () => (await getDisplacedsIds({})).displacedsIds,
    enabled: selectAllAcrossPages,
    staleTime: 1000 * 60 * 5,
  });

  const DISPLACED_DATA = displacedData;
  const isLoading = isLoadingRegular || isLoadingAll;
  const error = allQueryError || queryError;

  useEffect(() => {
    if (allDisplacedIDs && selectAllAcrossPages) {
      startTransition(() => {
        setSelectedDisplacedIds(allDisplacedIDs);
      });
    }
  }, [allDisplacedIDs, selectAllAcrossPages]);

  const isRowSelected = useCallback(
    (id: string) => selectedDisplacedIds.includes(id),
    [selectedDisplacedIds]
  );

  const areAllPagesRowsSelected = useCallback(
    () => selectedDisplacedIds.length === (displacedData?.pagination?.totalItems || 0),
    [selectedDisplacedIds, displacedData]
  );

  const handleRowSelection = useCallback(
    (id: string, checked: boolean) => {
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

  const headers = useMemo(
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

  // //////////////////////////////////////////////////////////

  // const queryClient = useQueryClient();

  const addDisplacedsMutation = useMutation<IActionResponse, unknown, IAddAidDisplacedsProps>({
    mutationFn: addAidDisplaceds,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تمت العملية بنجاح',
          message: data.message,
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        close();
      } else {
        throw new Error(data.error || 'فشل في إضافة النازحين للمساعدة');
      }
    },
    onError: (error: any) => {
      notifications.show({
        title: 'خطأ',
        message: error?.message || 'فشل في إضافة النازحين للمساعدة',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const { userId, userType } = useAlreadyUserStore();

  const delegatePortion =
    aidData.selectedDelegatesPortions?.find((item) => item.delegateId == userId)?.portion || 0;

  const handleAdd = () => {
    if (userType == USER_TYPE.DELEGATE) {
      if (selectedDisplacedIds.length == 0 || selectedDisplacedIds.length > delegatePortion) {
        notifications.show({
          title: 'خطأ',
          message: `عليك اختيار ${delegatePortion} عائلة فقط `,
          color: 'red',
          position: 'top-left',
          withBorder: true,
        });
        return;
      } else {
        addDisplacedsMutation.mutate({ aidId: aidData.id, displacedIds: selectedDisplacedIds });
      }
    }

    notifications.show({
      title: 'خطأ',
      message: 'غير مصرح لك يالاضافة',
      color: 'red',
      position: 'top-left',
      withBorder: true,
    });
    return;
  };

  //////////////////////////////////////////////////////////////
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
        </Group>
      )}

      <Table.ScrollContainer
        minWidth='100%'
        w='100%'
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
          <Table.Thead>{headers}</Table.Thead>
          <Table.Tbody>{rows.length === 0 ? noDisplaceds : rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination
        value={query.displaced_page}
        onChange={(value) => setQuery((prev) => ({ ...prev, displaced_page: value }))}
        total={DISPLACED_DATA?.pagination?.totalPages || 0}
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

      <Group justify='center'>
        <Button
          size='md'
          // variant=''
          onClick={handleAdd}
          fw={600}
          loading={addDisplacedsMutation.isPending}
          className='bg-primary! shadow-md! border-primary! text-white!'
        >
          اضافة النازحين
        </Button>
      </Group>
    </>
  );
}
