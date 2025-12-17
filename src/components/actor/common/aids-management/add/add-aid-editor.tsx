'use client';

import { Stack, LoadingOverlay, Group, Text, Divider } from '@mantine/core';
import { SquarePen, SquarePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { parseAsStringEnum, useQueryStates, parseAsString } from 'nuqs';

import { DISTRIBUTION_MECHANISM, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { manageAid } from '@/actions/actor/common/aids-management/manageAid';
import { useAlreadyUserStore } from '@/stores/alreadyUserStore';
import { USER_TYPE } from '@/constants/user-types';
import { getManagerRoutes } from '@/constants/routes';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import { useAidStore } from '@/stores/Aid.store';
import CommonAidForm from '../common/aid-form/common-aid-form';
import CommonAidDelegatesList from '../common/delegates/common-aid-delegates-list';
import CommonAidAddDisplaceds from '../common/aid-add-displaceds/common-aid-add-displaceds';
import { useState } from 'react';

const Header = ({ action }: { action: ACTION_ADD_EDIT_DISPLAY }) => {
  const titleMap: Record<ACTION_ADD_EDIT_DISPLAY, string> = {
    ADD: 'إضافة مساعدة جديدة',
    EDIT: 'تعديل المساعدة',
    DISPLAY: 'عرض المساعدة',
  };

  const isAdd = action === ACTION_ADD_EDIT_DISPLAY.ADD;

  return (
    <Group justify='space-between' w='100%'>
      <Group gap={8} align='center'>
        <div className='bg-primary/10 p-2 rounded-full'>
          {isAdd ? (
            <SquarePlus className='text-primary' size={20} />
          ) : (
            <SquarePen className='text-primary' size={20} />
          )}
        </div>
        <Text fz={18} fw={600} className='text-primary'>
          {titleMap[action]}
        </Text>
      </Group>
    </Group>
  );
};

export enum AidStep {
  AID_FORM,
  AID_DELEGATES,
  AID_DISPLACEDS,
  Final,
}
export default function AddAidEditor({ isLoading: parentLoading }: { isLoading: boolean }) {
  const [activeStep, setActiveStep] = useState<AidStep>(AidStep.AID_FORM);

  const handelActiveStep = ({ step }: { step: AidStep }) => {
    setActiveStep(step);
  };

  const router = useRouter();
  const { userId, userType } = useAlreadyUserStore();
  const {
    formValues,
    selectedDisplacedIds,
    selectedDelegatesPortions,
    aidStatus,
    receivedDisplaceds,
    securitiesId,
  } = useAidStore();
  console.log('🚀 ~ AddAidEditor ~ selectedDisplacedIds:', selectedDisplacedIds);

  const [query] = useQueryStates({
    action: parseAsStringEnum(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.ADD
    ),
    aidId: parseAsString.withDefault(''),
  });

  // const isDisplay = query.action === ACTION_ADD_EDIT_DISPLAY.DISPLAY;
  const isDisplacedMechanism =
    formValues.distributionMechanism === DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES;

  const mutation = useMutation({
    mutationFn: () =>
      manageAid({
        payload: {
          ...formValues,
          id: query.aidId ?? '',
          selectedDisplacedIds: isDisplacedMechanism ? selectedDisplacedIds : [],
          selectedDelegatesPortions: isDisplacedMechanism ? [] : selectedDelegatesPortions,
          isCompleted: true,
          aidStatus: aidStatus ?? TYPE_GROUP_AIDS.ONGOING_AIDS,
          receivedDisplaceds: receivedDisplaceds ?? [],
          securitiesId: securitiesId ?? [],
          selectedCategories: formValues.selectedCategories,
        },
        actorId: userId,
        role: userType as USER_TYPE.MANAGER | USER_TYPE.DELEGATE,
        isUpdate: query.action === ACTION_ADD_EDIT_DISPLAY.EDIT,
      }),
    onSuccess: (res) => {
      notifications.show({
        title: query.action === ACTION_ADD_EDIT_DISPLAY.EDIT ? 'تم التعديل' : 'تم الإضافة',
        message: res.message || 'تم حفظ المساعدة بنجاح',
        color: 'green',
        position: 'top-left',
      });
      router.push(getManagerRoutes({ managerId: userId }).AIDS_MANAGEMENT);
    },
    onError: (err: any) => {
      notifications.show({
        title: 'فشل العملية',
        message: err?.message || 'حدث خطأ',
        color: 'red',
        position: 'top-left',
      });
    },
  });

  const handleSubmit = () => {
    if (isDisplacedMechanism && selectedDisplacedIds.length === 0) {
      return notifications.show({
        title: 'مطلوب',
        message: 'يجب اختيار نازحين',
        color: 'red',
        position: 'top-left',
      });
    }
    if (!isDisplacedMechanism && selectedDelegatesPortions.length === 0) {
      return notifications.show({
        title: 'مطلوب',
        message: 'يجب تحديد حصص المناديب',
        color: 'red',
        position: 'top-left',
      });
    }
    // console.log('🚀 ~ AddAidEditor ~ formValues:', formValues);

    mutation.mutate();
  };

  const loading = parentLoading || mutation.isPending;
  if (loading) <LoadingOverlay visible={loading} />;

  return (
    <Stack pos='relative'>
      <Header action={query.action} />

      {activeStep == AidStep.AID_FORM && <CommonAidForm handelActiveStep={handelActiveStep} />}

      {activeStep == AidStep.AID_DELEGATES && !isDisplacedMechanism && (
        <>
          <Divider />
          <CommonAidDelegatesList handelActiveStep={handelActiveStep} />
        </>
      )}

      {activeStep === AidStep.AID_DISPLACEDS && (
        <>
          <Divider />
          <CommonAidAddDisplaceds handelActiveStep={handelActiveStep} handleSubmit={handleSubmit} />
        </>
      )}
    </Stack>
  );
}
