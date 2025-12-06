'use client';

import { IMG_MAN } from '@/assets/actor';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  NativeSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { CustomPhoneInput } from '@/components/common/custom/custom-phone-input';
import { GENERAL_ACTOR_ROUTES, getDelegateRoutes } from '@/constants/routes';
// import useGetDelegatesNames from '@/hooks/use-get-delegate-names.hook';
import useAuth from '@/hooks/useAuth';
import { handleUploadMedia } from '@/utils/uploadthing/handleUploadMedia';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Eye, Plus, Save, Trash, UserPen } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  displacedProfileFormSchema,
  TDisplacedProfileFormValues,
} from '@/validations/actor/displaceds/profile/displaced-profile.schema';
import { IActionResponse } from '@/types/common/action-response.type';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  ACCOMMODATION_TYPE,
  ACCOMMODATION_TYPE_LABELS,
  AGES,
  AGES_LABELS,
  FAMILY_STATUS_TYPE,
  FAMILY_STATUS_TYPE_LABELS,
  GENDER,
  GENDER_LABELS,
  SOCIAL_STATUS,
  SOCIAL_STATUS_LABELS,
} from '@/types/actor/common/index.type';
import { IDisplacedProfileResponse } from '@/types/actor/displaceds/profile/displaced-profile.type';
import { getDisplacedProfile } from '@/actions/actor/displaceds/profile/getDisplacedProfile';
import {
  IUpdateDisplacedProfileProps,
  updateDisplacedProfile,
} from '@/actions/actor/displaceds/profile/updateDisplacedProfile';
import {
  addNewDisplaced,
  IAddNewDisplacedProps,
} from '@/actions/actor/displaceds/profile/addNewDisplaced';
import useGetDelegatesNames from '@/hooks/useGetDelegatesNames';
import ProfileWrapper from '../../common/profile-wrapper/profile-wrapper';

export default function DisplacedProfileForm({
  displacedId,
  destination,
}: {
  displacedId?: number;
  destination?: ACTION_ADD_EDIT_DISPLAY;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [query, setQuery] = useQueryState(
    'action',
    parseAsStringEnum<ACTION_ADD_EDIT_DISPLAY>(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      destination ?? ACTION_ADD_EDIT_DISPLAY.DISPLAY
    )
  );

  const { isDelegate, isManager } = useAuth();

  const isAddMode = (isManager || isDelegate) && destination === ACTION_ADD_EDIT_DISPLAY.ADD;
  const isEditMode = (isManager || isDelegate) && query === ACTION_ADD_EDIT_DISPLAY.EDIT;
  const isDisplayMode =
    query === ACTION_ADD_EDIT_DISPLAY.DISPLAY && destination !== ACTION_ADD_EDIT_DISPLAY.ADD;

  const { startUpload } = useUploadThing('mediaUploader');
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(IMG_MAN.src);

  const form = useForm<TDisplacedProfileFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      identity: '',
      gender: GENDER.MALE,
      nationality: '',
      originalAddress: '',
      mobileNumber: '',
      profileImage: null,
      alternativeMobileNumber: '',
      wives: [],
      socialStatus: {
        status: SOCIAL_STATUS.SINGLE,
        numberOfWives: 0,
        numberOfMales: 0,
        numberOfFemales: 0,
        totalFamilyMembers: 1,
        ageGroups: {
          [AGES.LESS_THAN_6_MONTHS]: 0,
          [AGES.FROM_6_MONTHS_TO_2_YEARS]: 0,
          [AGES.FROM_2_YEARS_To_6_YEARS]: 0,
          [AGES.FROM_6_YEARS_To_12_YEARS]: 0,
          [AGES.FROM_12_YEARS_To_18_YEARS]: 0,
          [AGES.MORE_THAN_18]: 0,
        },
      },
      displacement: {
        tentNumber: '',
        tentType: ACCOMMODATION_TYPE.INDOOR_TENT,
        familyStatusType: FAMILY_STATUS_TYPE.NORMAL,
        displacementDate: '',
        delegate: {
          id: '',
          name: '',
        },
      },
      warInjuries: [],
      martyrs: [],
      medicalConditions: [],
      additionalNotes: '',
    },
    validate: zod4Resolver(displacedProfileFormSchema),
    validateInputOnChange: true,
  });

  const {
    data: displacedProfileData,
    isLoading: isLoadingFetch,
    refetch,
  } = useQuery<IDisplacedProfileResponse>({
    queryKey: ['displaced-profile', displacedId],
    queryFn: () => getDisplacedProfile({ displacedId: displacedId as number }),
    enabled: !!displacedId && (isDisplayMode || isEditMode),
  });

  // Fetch delegate data based on mode
  const { delegatesData, isLoading: isLoadingDelegates } = useGetDelegatesNames({
    ids:
      isDisplayMode && displacedId
        ? [Number(displacedProfileData?.user.displacement.delegate.id)]
        : undefined,
    mode: query,
  });

  const [delegatesNames, setDelegatesNames] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (delegatesData?.delegateNames) {
      setDelegatesNames(
        delegatesData.delegateNames.map((item) => ({
          ...item,
          id: item.id.toString(),
        }))
      );
    }
  }, [delegatesData, isLoadingDelegates]);

  const delegateOptions = useMemo(
    () =>
      delegatesNames.map((delegate) => ({
        value: delegate.id.toString(),
        label: delegate.name,
      })),
    [delegatesNames]
  );

  const applyData = ({
    displacedData,
  }: {
    displacedData: IDisplacedProfileResponse | undefined;
  }) => {
    if (!isAddMode && displacedData && displacedData.status === 200 && displacedData.user) {
      const userData = displacedData.user;

      setProfileImage(userData.profileImage ?? IMG_MAN.src);

      const delegate = delegatesNames.find(
        (item) => item.id.toString() === userData.displacement.delegate.id.toString()
      ) || {
        id: userData.displacement.delegate.id.toString(),
        name: userData.displacement.delegate.name,
      };

      form.setValues({
        name: userData.name,
        email: userData.email || '',
        identity: userData.identity,
        gender: userData.gender,
        nationality: userData.nationality,
        originalAddress: userData.originalAddress,
        profileImage: userData.profileImage || null,
        mobileNumber:
          userData.mobileNumber.length === 10
            ? `+970${userData.mobileNumber}`
            : userData.mobileNumber,
        alternativeMobileNumber:
          userData.alternativeMobileNumber?.length === 10
            ? `+970${userData.alternativeMobileNumber}`
            : userData.alternativeMobileNumber || '',
        wives: userData.wives || [],
        socialStatus: {
          status: userData.socialStatus?.status || SOCIAL_STATUS.SINGLE,
          numberOfWives: userData.socialStatus?.numberOfWives || 0,
          numberOfMales: userData.socialStatus?.numberOfMales || 0,
          numberOfFemales: userData.socialStatus?.numberOfFemales || 0,
          totalFamilyMembers: userData.socialStatus?.totalFamilyMembers || 1,
          ageGroups: {
            [AGES.LESS_THAN_6_MONTHS]:
              userData.socialStatus?.ageGroups?.[AGES.LESS_THAN_6_MONTHS] || 0,
            [AGES.FROM_6_MONTHS_TO_2_YEARS]:
              userData.socialStatus?.ageGroups?.[AGES.FROM_6_MONTHS_TO_2_YEARS] || 0,
            [AGES.FROM_2_YEARS_To_6_YEARS]:
              userData.socialStatus?.ageGroups?.[AGES.FROM_2_YEARS_To_6_YEARS] || 0,
            [AGES.FROM_6_YEARS_To_12_YEARS]:
              userData.socialStatus?.ageGroups?.[AGES.FROM_6_YEARS_To_12_YEARS] || 0,
            [AGES.FROM_12_YEARS_To_18_YEARS]:
              userData.socialStatus?.ageGroups?.[AGES.FROM_12_YEARS_To_18_YEARS] || 0,
            [AGES.MORE_THAN_18]: userData.socialStatus?.ageGroups?.[AGES.MORE_THAN_18] || 0,
          },
        },
        displacement: {
          tentNumber: userData.displacement?.tentNumber || '',
          tentType: userData.displacement?.tentType || ACCOMMODATION_TYPE.INDOOR_TENT,
          familyStatusType: userData.displacement?.familyStatusType || FAMILY_STATUS_TYPE.NORMAL,
          displacementDate: userData.displacement?.displacementDate || '',
          delegate,
        },
        warInjuries: userData.warInjuries || [],
        martyrs: userData.martyrs || [],
        medicalConditions: userData.medicalConditions || [],
        additionalNotes: userData.additionalNotes || '',
      });
      form.clearErrors();
      form.resetTouched();
      form.resetDirty();
    } else if (isAddMode) {
      form.reset();
      setProfileImage(IMG_MAN.src);
      form.setFieldValue('displacement.delegate', { id: '', name: '' });
    }
  };

  useEffect(() => {
    applyData({ displacedData: displacedProfileData });
  }, [displacedProfileData, isAddMode, isLoadingDelegates, delegatesNames]);

  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const updateProfileMutation = useMutation<IActionResponse, Error, IUpdateDisplacedProfileProps>({
    mutationFn: updateDisplacedProfile,
    onSuccess: (data) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      if (data.status === 200) {
        notifications.show({
          title: 'تم التحديث',
          message: 'تم تحديث الملف الشخصي للنازح بنجاح',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        // applyData({ displacedData: data });
        refetch();
        queryClient.invalidateQueries({ queryKey: ['displaced-profile'] });
      } else {
        throw new Error(data.error || 'فشل في تحديث الملف الشخصي للنازح');
      }
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      const errorMessage = error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي للنازح';
      form.setErrors({ general: errorMessage });
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const addDisplacedProfileMutation = useMutation<IActionResponse, Error, IAddNewDisplacedProps>({
    mutationFn: addNewDisplaced,
    onSuccess: (data) => {
      if (data.status === 201) {
        notifications.show({
          title: 'تم الإضافة',
          message: 'تمت إضافة نازح جديد بنجاح',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });
        queryClient.invalidateQueries({ queryKey: ['displaceds'] });
        router.push(GENERAL_ACTOR_ROUTES.DISPLACEDS);
      } else {
        throw new Error(data.error || 'فشل في إضافة النازح الجديد');
      }
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      const errorMessage = error?.message || 'حدث خطأ أثناء إضافة النازح الجديد';
      form.setErrors({ general: errorMessage });
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const uploadImages = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    try {
      setUploading(true);
      const mediaUrl = await handleUploadMedia(file, startUpload);
      if (!mediaUrl) throw new Error('فشل في رفع الصورة. يرجى المحاولة مرة أخرى.');
      return mediaUrl;
    } catch {
      notifications.show({
        title: 'فشل الرفع',
        message: 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.',
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = form.onSubmit(async (values: TDisplacedProfileFormValues) => {
    console.log('🚀 ~ values:', values);
    const avatarUrl =
      profileImage instanceof File
        ? await uploadImages(profileImage)
        : (profileImage as string | null) ?? null;

    const payload: TDisplacedProfileFormValues = {
      ...values,
      profileImage: avatarUrl,
    };
    console.log('🚀 ~ DisplacedProfileForm ~ payload:', payload);

    const handleError = (error: unknown) => {
      const errorMessage = (error as Error)?.message || 'فشل في حفظ الملف الشخصي للنازح';
      form.setErrors({ general: errorMessage });
      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    };

    try {
      if (isAddMode) {
        addDisplacedProfileMutation.mutate({ payload }, { onError: handleError });
      }
      if (isEditMode) {
        updateProfileMutation.mutate(
          { displacedId: displacedId as number, payload },
          { onError: handleError }
        );
      }
    } catch (error) {
      handleError(error);
    }
  });

  const addWife = () => {
    form.insertListItem('wives', {
      name: '',
      identity: '',
      nationality: '',
      isPregnant: false,
      isWetNurse: false,
    });
  };

  const removeWife = (index: number) => {
    form.removeListItem('wives', index);
  };

  const addWarInjury = () => {
    form.insertListItem('warInjuries', { name: '', injury: '' });
  };

  const removeWarInjury = (index: number) => {
    form.removeListItem('warInjuries', index);
  };

  const addMartyr = () => {
    form.insertListItem('martyrs', { name: '' });
  };

  const removeMartyr = (index: number) => {
    form.removeListItem('martyrs', index);
  };

  const addMedicalCondition = () => {
    form.insertListItem('medicalConditions', { name: '', condition: '' });
  };

  const removeMedicalCondition = (index: number) => {
    form.removeListItem('medicalConditions', index);
  };

  const isMutationLoading =
    updateProfileMutation.isPending || addDisplacedProfileMutation.isPending;

  const handleOpenDelegateProfile = (event: React.MouseEvent) => {
    event.preventDefault();
    const selectedDelegateId = form.getValues().displacement.delegate.id;
    if (selectedDelegateId) {
      router.push(getDelegateRoutes({ delegateId: Number(selectedDelegateId) }).PROFILE);
    }
  };

  return (
    <ProfileWrapper
      mode={isEditMode || isAddMode}
      loading={isLoadingFetch || isMutationLoading || uploading}
      setProfileImage={setProfileImage}
      profileImage={profileImage}
    >
      <Stack my={100}>
        <form onSubmit={handleSubmit}>
          <Group wrap='nowrap' align='center'>
            <Text ta='start' fz={18} fw={600} className='text-primary!'>
              {isAddMode ? 'إضافة نازح جديد :' : 'البيانات الشخصية :'}
            </Text>
            {(isManager || isDelegate) && isDisplayMode && (
              <Button
                variant='filled'
                size='xs'
                color='primary'
                rightSection={<UserPen size={16} />}
                loading={isMutationLoading}
                onClick={() => setQuery(ACTION_ADD_EDIT_DISPLAY.EDIT)}
                fw={500}
                fz={16}
                className='shadow-sm'
              >
                تعديل
              </Button>
            )}
          </Group>

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            my={20}
            w='100%'
            className='bg-gray-50 shadow-md rounded-lg'
            p={16}
          >
            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  الاسم :
                </Text>
              }
              placeholder='ادخل الاسم...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('name')}
              disabled={isDisplayMode}
            />
            <TextInput
              type='email'
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  البريد الإلكتروني :
                </Text>
              }
              placeholder='ادخل البريد الإلكتروني...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('email')}
              disabled={isDisplayMode}
            />
            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  رقم الهوية :
                </Text>
              }
              placeholder='ادخل رقم الهوية...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('identity')}
              disabled={isDisplayMode}
            />
            <NativeSelect
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  الجنس :
                </Text>
              }
              data={Object.entries(GENDER).map(([key, value]) => ({
                value,
                label: GENDER_LABELS[value as GENDER],
              }))}
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('gender')}
              disabled={isDisplayMode}
            />
            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  الجنسية :
                </Text>
              }
              placeholder='ادخل الجنسية...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('nationality')}
              disabled={isDisplayMode}
            />
            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  عنوان السكن الأصلي :
                </Text>
              }
              placeholder='ادخل عنوان السكن الأصلي...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
              }}
              {...form.getInputProps('originalAddress')}
              disabled={isDisplayMode}
            />
            <Stack w='100%' gap={0}>
              <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                رقم الجوال :
              </Text>
              <Box dir='ltr' className='w-full'>
                <PhoneInput
                  name='mobileNumber'
                  international
                  countryCallingCodeEditable={true}
                  defaultCountry='PS'
                  inputComponent={CustomPhoneInput}
                  placeholder='ادخل رقم الجوال...'
                  value={form.getValues().mobileNumber as string}
                  key={form.key('mobileNumber')}
                  {...form.getInputProps('mobileNumber')}
                  disabled={isDisplayMode}
                />
              </Box>
            </Stack>
            {(isEditMode ||
              isAddMode ||
              (displacedProfileData?.user.alternativeMobileNumber &&
                displacedProfileData.user.alternativeMobileNumber !== '')) && (
              <Stack w='100%' gap={0}>
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  رقم بديل :
                </Text>
                <Box dir='ltr' className='w-full'>
                  <PhoneInput
                    name='alternativeMobileNumber'
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry='PS'
                    inputComponent={CustomPhoneInput}
                    placeholder='ادخل رقم بديل...'
                    value={form.getValues().alternativeMobileNumber as string}
                    {...form.getInputProps('alternativeMobileNumber')}
                    disabled={isDisplayMode}
                  />
                </Box>
              </Stack>
            )}
          </SimpleGrid>

          <Divider h={2} w='100%' mt={20} />

          <Stack my={20}>
            <Group justify='space-between' align='center'>
              <Text fz={18} fw={600} className='text-primary!'>
                بيانات الزوجات :
              </Text>
              {(isEditMode || isAddMode) && (
                <Button
                  variant='outline'
                  size='xs'
                  color='primary'
                  rightSection={<Plus size={16} />}
                  onClick={addWife}
                >
                  إضافة زوجة
                </Button>
              )}
            </Group>
            <Box className='bg-gray-50 shadow-md rounded-lg' p={16}>
              {form.getValues().wives.map((wife, index) => (
                <Box key={index}>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} w={'100%'}>
                    <TextInput
                      label={
                        <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                          اسم الزوجة :
                        </Text>
                      }
                      placeholder='ادخل اسم الزوجة...'
                      size='sm'
                      w='100%'
                      classNames={{
                        input:
                          'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                      }}
                      {...form.getInputProps(`wives.${index}.name`)}
                      disabled={isDisplayMode}
                    />
                    <TextInput
                      label={
                        <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                          رقم هوية الزوجة :
                        </Text>
                      }
                      placeholder='ادخل رقم هوية الزوجة...'
                      size='sm'
                      w='100%'
                      classNames={{
                        input:
                          'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                      }}
                      {...form.getInputProps(`wives.${index}.identity`)}
                      disabled={isDisplayMode}
                    />
                    <TextInput
                      label={
                        <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                          جنسية الزوجة :
                        </Text>
                      }
                      placeholder='ادخل جنسية الزوجة...'
                      size='sm'
                      w='100%'
                      classNames={{
                        input:
                          'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                      }}
                      {...form.getInputProps(`wives.${index}.nationality`)}
                      disabled={isDisplayMode}
                    />
                    <Group gap={10}>
                      <Checkbox
                        label={
                          <Text fz={16} fw={500} className='text-gray-700!'>
                            حامل
                          </Text>
                        }
                        {...form.getInputProps(`wives.${index}.isPregnant`, {
                          type: 'checkbox',
                        })}
                        disabled={isDisplayMode}
                      />
                      <Checkbox
                        label={
                          <Text fz={16} fw={500} className='text-gray-700!'>
                            مرضعة
                          </Text>
                        }
                        {...form.getInputProps(`wives.${index}.isWetNurse`, {
                          type: 'checkbox',
                        })}
                        disabled={isDisplayMode}
                      />
                      {(isEditMode || isAddMode) && (
                        <ActionIcon variant='outline' color='red' onClick={() => removeWife(index)}>
                          <Trash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </SimpleGrid>
                  <Divider
                    h={2}
                    w='95%'
                    mt={10}
                    mx={'auto'}
                    hidden={form.getValues().wives.length == index + 1}
                  />
                </Box>
              ))}
            </Box>
          </Stack>

          <Stack my={20}>
            <Text fz={18} fw={600} className='text-primary!'>
              بيانات الحالة الاجتماعية :
            </Text>
            <SimpleGrid
              cols={{ base: 2, md: 4 }}
              w={'100%'}
              className='bg-gray-50 shadow-md rounded-lg преимуще'
              p={16}
            >
              <NativeSelect
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    الحالة الاجتماعية :
                  </Text>
                }
                data={Object.entries(SOCIAL_STATUS).map(([key, value]) => ({
                  value,
                  label: SOCIAL_STATUS_LABELS[value as SOCIAL_STATUS],
                }))}
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('socialStatus.status')}
                disabled={isDisplayMode}
              />

              <NumberInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    عدد الذكور :
                  </Text>
                }
                placeholder='ادخل عدد الذكور...'
                size='sm'
                w='100%'
                value={form.getValues().socialStatus.numberOfMales}
                key={form.key('socialStatus.numberOfMales')}
                {...form.getInputProps('socialStatus.numberOfMales')}
                disabled={isDisplayMode}
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
              />

              <NumberInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    عدد الإناث :
                  </Text>
                }
                placeholder='ادخل عدد الإناث...'
                size='sm'
                w='100%'
                value={form.getValues().socialStatus.numberOfFemales}
                key={form.key('socialStatus.numberOfFemales')}
                {...form.getInputProps('socialStatus.numberOfFemales')}
                disabled={isDisplayMode}
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
              />

              {Object.values(AGES).map((ageGroup) => {
                const value = form.getValues().socialStatus.ageGroups[ageGroup];
                return (
                  <NumberInput
                    key={ageGroup}
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        {AGES_LABELS[ageGroup]} :
                      </Text>
                    }
                    placeholder={`ادخل عدد ${AGES_LABELS[ageGroup]}...`}
                    size='sm'
                    w='100%'
                    value={value}
                    {...form.getInputProps(`socialStatus.ageGroups.${ageGroup}`)}
                    disabled={isDisplayMode}
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                  />
                );
              })}
            </SimpleGrid>
          </Stack>

          <Stack my={20}>
            <Text fz={18} fw={600} className='text-primary!'>
              بيانات النزوح :
            </Text>
            <SimpleGrid
              cols={{ base: 1, md: 3 }}
              w='100%'
              className='bg-gray-50 shadow-md rounded-lg'
              p={16}
            >
              <TextInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    رقم الخيمة :
                  </Text>
                }
                placeholder='ادخل رقم الخيمة...'
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('displacement.tentNumber')}
                disabled={isDisplayMode}
              />
              <NativeSelect
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    نوع الإيواء :
                  </Text>
                }
                data={Object.entries(ACCOMMODATION_TYPE).map(([key, value]) => ({
                  value,
                  label: ACCOMMODATION_TYPE_LABELS[value as ACCOMMODATION_TYPE],
                }))}
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('displacement.tentType')}
                disabled={isDisplayMode}
              />
              <NativeSelect
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    نوع حالة الأسرة :
                  </Text>
                }
                data={Object.entries(FAMILY_STATUS_TYPE).map(([key, value]) => ({
                  value,
                  label: FAMILY_STATUS_TYPE_LABELS[value as FAMILY_STATUS_TYPE],
                }))}
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('displacement.familyStatusType')}
                disabled={isDisplayMode}
              />
              <TextInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                    تاريخ النزوح :
                  </Text>
                }
                type='date'
                placeholder='ادخل تاريخ النزوح...'
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('displacement.displacementDate')}
                disabled={isDisplayMode}
              />
              <Select
                label={
                  <Group w={'100%'} justify='space-between'>
                    <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                      المندوب :
                    </Text>
                    {form.getValues().displacement.delegate.id && (
                      <ActionIcon size={20} variant='light' onClick={handleOpenDelegateProfile}>
                        <Eye size={18} />
                      </ActionIcon>
                    )}
                  </Group>
                }
                placeholder='اختر المندوب...'
                size='sm'
                w='100%'
                classNames={{
                  label: '!w-full',
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                data={delegateOptions}
                searchable
                clearable
                disabled={isDisplayMode || isLoadingDelegates || !isManager}
                aria-label='اختر المندوب'
                clearButtonProps={{ 'aria-label': 'مسح المندوب' }}
                value={form.getValues().displacement.delegate.id.toString() || undefined}
                onChange={(value, option) => {
                  form.setFieldValue('displacement.delegate', {
                    id: value ? value.toString() : '',
                    name: value ? option?.label || '' : '',
                  });
                }}
              />
            </SimpleGrid>
          </Stack>

          <Box className='bg-gray-50 shadow-md rounded-lg' p={16}>
            <Stack>
              <Group justify='space-between' align='center'>
                <Text fz={18} fw={600} className='text-primary!'>
                  إصابات الحرب :
                </Text>
                {(isEditMode || isAddMode) && (
                  <Button
                    variant='outline'
                    size='xs'
                    color='primary'
                    rightSection={<Plus size={16} />}
                    onClick={addWarInjury}
                  >
                    إضافة إصابة
                  </Button>
                )}
              </Group>
              {form.getValues().warInjuries.map((injury, index) => (
                <SimpleGrid key={index} cols={{ base: 1, md: 3 }} w='100%'>
                  <TextInput
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        اسم المصاب :
                      </Text>
                    }
                    placeholder='ادخل اسم المصاب...'
                    size='sm'
                    w='100%'
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                    {...form.getInputProps(`warInjuries.${index}.name`)}
                    disabled={isDisplayMode}
                  />
                  <TextInput
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        الإصابة :
                      </Text>
                    }
                    placeholder='ادخل وصف الإصابة...'
                    size='sm'
                    w='100%'
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                    {...form.getInputProps(`warInjuries.${index}.injury`)}
                    disabled={isDisplayMode}
                  />
                  {(isEditMode || isAddMode) && (
                    <ActionIcon
                      variant='outline'
                      color='red'
                      onClick={() => removeWarInjury(index)}
                      size={24}
                      mt={30}
                      radius={8}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  )}
                </SimpleGrid>
              ))}
            </Stack>

            <Divider h={2} w='100%' mt={20} />

            <Stack my={20} gap={0}>
              <Group justify='space-between' align='center'>
                <Text fz={18} fw={600} className='text-primary!'>
                  الشهداء :
                </Text>
                {(isEditMode || isAddMode) && (
                  <Button
                    variant='outline'
                    size='xs'
                    color='primary'
                    rightSection={<Plus size={16} />}
                    onClick={addMartyr}
                  >
                    إضافة شهيد
                  </Button>
                )}
              </Group>
              {form.getValues().martyrs.map((martyr, index) => (
                <SimpleGrid key={index} cols={{ base: 1, md: 3 }} w='100%'>
                  <TextInput
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        اسم الشهيد :
                      </Text>
                    }
                    placeholder='ادخل اسم الشهيد...'
                    size='sm'
                    w='100%'
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                    {...form.getInputProps(`martyrs.${index}.name`)}
                    disabled={isDisplayMode}
                  />
                  {(isEditMode || isAddMode) && (
                    <ActionIcon
                      variant='outline'
                      color='red'
                      onClick={() => removeMartyr(index)}
                      size={24}
                      mt={30}
                      radius={8}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  )}
                </SimpleGrid>
              ))}
            </Stack>

            <Divider h={2} w='100%' mt={20} />

            <Stack my={20} gap={0}>
              <Group justify='space-between' align='center'>
                <Text fz={18} fw={600} className='text-primary!'>
                  الحالات المرضية :
                </Text>
                {(isEditMode || isAddMode) && (
                  <Button
                    variant='outline'
                    size='xs'
                    color='primary'
                    rightSection={<Plus size={16} />}
                    onClick={addMedicalCondition}
                  >
                    إضافة حالة مرضية
                  </Button>
                )}
              </Group>
              {form.getValues().medicalConditions.map((condition, index) => (
                <SimpleGrid key={index} cols={{ base: 1, md: 3 }} w='100%'>
                  <TextInput
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        اسم المريض :
                      </Text>
                    }
                    placeholder='ادخل اسم المريض...'
                    size='sm'
                    w='100%'
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                    {...form.getInputProps(`medicalConditions.${index}.name`)}
                    disabled={isDisplayMode}
                  />
                  <TextInput
                    label={
                      <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                        الحالة المرضية :
                      </Text>
                    }
                    placeholder='ادخل الحالة المرضية...'
                    size='sm'
                    w='100%'
                    classNames={{
                      input:
                        'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                    }}
                    {...form.getInputProps(`medicalConditions.${index}.condition`)}
                    disabled={isDisplayMode}
                  />
                  {(isEditMode || isAddMode) && (
                    <ActionIcon
                      variant='outline'
                      color='red'
                      onClick={() => removeMedicalCondition(index)}
                      size={24}
                      mt={30}
                      radius={8}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  )}
                </SimpleGrid>
              ))}
            </Stack>

            <Divider h={2} w='100%' mt={20} />
            <Stack my={20}>
              <Textarea
                label={
                  <Text fz={18} fw={600} mb={4} className='text-nowrap! text-primary!'>
                    ملاحظات إضافية :
                  </Text>
                }
                placeholder='ادخل ملاحظات إضافية...'
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:!cursor-text !bg-white placeholder:!text-sm text-primary! font-normal!',
                }}
                {...form.getInputProps('additionalNotes')}
                disabled={isDisplayMode}
              />
            </Stack>
          </Box>

          {(isEditMode || isAddMode) && (
            <Group justify='center' w={'100%'} mt={20}>
              <Button
                type='submit'
                variant='filled'
                size='xs'
                color='primary'
                loading={isMutationLoading}
                fw={500}
                fz={16}
                className='shadow-sm'
                rightSection={isEditMode ? <UserPen size={16} /> : <Save size={16} />}
              >
                {isAddMode ? 'إضافة' : 'حفظ التعديلات'}
              </Button>
            </Group>
          )}
        </form>
      </Stack>
    </ProfileWrapper>
  );
}
