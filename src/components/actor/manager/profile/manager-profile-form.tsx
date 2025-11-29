'use client';

import { IMG_MAN } from '@/assets/actor';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import {
  Box,
  Button,
  Group,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ProfileWrapper } from '../../common';

import { getManagerProfile } from '@/actions/actors/manager/profile/getManagerProfile';
import {
  updateManagerProfile,
  UpdateManagerProfileProps,
} from '@/actions/actors/manager/profile/updateManagerProfile';
import { CustomPhoneInput } from '@/components/common/custom/custom-phone-input';
import useAuth from '@/hooks/useAuth';
import {
  ACTION_ADD_EDIT_DISPLAY,
  GENDER,
  GENDER_LABELS,
  SOCIAL_STATUS,
} from '@/types/common/actors-information.type';
import { ManagerProfileResponse } from '@/types/manager/profile/manager-profile-response.type';
import { handleUploadMedia } from '@/utils/uploadthing/handleUploadMedia';
import {
  ManagerProfileSchema,
  ManagerProfileType,
} from '@/validations/actor/manager/profile/manager-profile-Schema';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { UserPen } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect, useState } from 'react';

const ManagerProfileForm = ({ managerId }: { managerId: number }) => {
  const queryClient = useQueryClient();

  const { startUpload } = useUploadThing('mediaUploader');
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(IMG_MAN.src);

  const { isManager, user } = useAuth();
  const isOwner = isManager && user?.id === managerId;

  const [query, setQuery] = useQueryState(
    'action',
    parseAsStringEnum<ACTION_ADD_EDIT_DISPLAY>(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      ACTION_ADD_EDIT_DISPLAY.DISPLAY
    )
  );

  const isEditMode = isOwner && query === ACTION_ADD_EDIT_DISPLAY.EDIT;

  const isDisplayMode = query === ACTION_ADD_EDIT_DISPLAY.DISPLAY;

  const form = useForm<ManagerProfileType>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      identity: '',
      gender: GENDER.MALE,
      social_status: SOCIAL_STATUS.SINGLE,
      nationality: '',
      email: '',
      phone_number: '',
      profile_image: null,
      alternative_phone_number: '',
    },
    validate: zod4Resolver(ManagerProfileSchema),
    validateInputOnChange: true, // validate Inputs On Change
  });

  const {
    data: managerProfileData,
    isLoading: isLoadingFetch,
    refetch,
  } = useQuery<ManagerProfileResponse>({
    queryKey: ['manager-profile', managerId],
    queryFn: () => getManagerProfile({ manager_Id: managerId as number }),
  });

  const applyData = ({ managerData }: { managerData: ManagerProfileResponse | undefined }) => {
    if (managerData) {
      if (managerData.status === 200 && managerData.user) {
        const userData = managerData.user;

        setProfileImage(userData.profile_image ?? IMG_MAN.src);

        form.setValues({
          name: userData.name,
          email: userData.email,
          identity: userData.identity,
          gender: userData.gender,
          nationality: userData.nationality,
          phone_number:
            userData.phone_number.length === 10
              ? `+970${userData.phone_number}`
              : userData.phone_number,
          alternative_phone_number:
            userData.alternative_phone_number?.length === 10
              ? `+970${userData.alternative_phone_number}`
              : userData.alternative_phone_number || '',
          social_status: userData.social_status,
        });
        form.clearErrors();
        form.resetTouched();
        form.resetDirty();
      } else {
        notifications.show({
          title: 'خطأ',
          message: managerData.error || 'فشل في تحميل بيانات الملف الشخصي للمدير',
          color: 'red',
          position: 'top-left',
          withBorder: true,
        });
      }
    }
  };

  useEffect(() => {
    applyData({ managerData: managerProfileData });
  }, [managerProfileData]);

  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const updateProfileMutation = useMutation<
    ManagerProfileResponse,
    Error,
    UpdateManagerProfileProps
  >({
    mutationFn: updateManagerProfile,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم التحديث',
          message: 'تم تحديث الملف الشخصي بنجاح',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });

        applyData({ managerData: data });
        setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
        refetch();
        queryClient.invalidateQueries({ queryKey: ['manager-profile'] });
      } else {
        throw new Error(data.error || 'فشل في تحديث الملف الشخصي');
      }
    },
    onError: (error: any) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      const errorMessage = error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي';
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

  const handleSubmit = form.onSubmit(async (values: ManagerProfileType) => {
    console.log('🚀 ~  ~ values:', values);
    const avatarUrl =
      profileImage instanceof File
        ? await uploadImages(profileImage)
        : (profileImage as string | null) ?? null;

    const payload: ManagerProfileType = {
      ...values,
      profile_image: avatarUrl ?? '',
    };
    console.log('🚀 ~  ~ payload:', payload);

    const handleError = (error: unknown) => {
      const errorMessage = (error as Error)?.message || 'فشل في حفظ الملف الشخصي للمدير';
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
      if (isEditMode) {
        updateProfileMutation.mutate(
          { manager_Id: managerId as number, payload },
          { onError: handleError }
        );
      }
    } catch (error) {
      handleError(error);
    }
  });

  const isMutationLoading = updateProfileMutation.isPending;

  return (
    <ProfileWrapper mode={isEditMode} loading={isLoadingFetch || isMutationLoading || uploading}>
      <Stack mt={100}>
        <form onSubmit={handleSubmit}>
          <Group wrap='nowrap' align='center'>
            <Text ta='start' fz={18} fw={600} className='text-primary!'>
              البيانات الشخصية
            </Text>
            {isOwner && isDisplayMode && (
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
                  'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
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
                  'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
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
                  'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
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
                  'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
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
                  'disabled:!cursor-text !bg-white placeholder:!text-sm !text-primary !font-normal',
              }}
              {...form.getInputProps('nationality')}
              disabled={isDisplayMode}
            />

            <Stack w='100%' gap={0}>
              <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                رقم الجوال :
              </Text>
              <Box dir='ltr' className='w-full'>
                <PhoneInput
                  name='phone_number'
                  international
                  countryCallingCodeEditable={true}
                  defaultCountry='PS'
                  inputComponent={CustomPhoneInput}
                  placeholder='ادخل رقم الجوال...'
                  value={form.getValues().phone_number as string}
                  key={form.key('phone_number')}
                  {...form.getInputProps('phone_number')}
                  disabled={isDisplayMode}
                />
              </Box>
            </Stack>

            {(isEditMode ||
              (managerProfileData?.user.alternative_phone_number &&
                managerProfileData.user.alternative_phone_number !== '')) && (
              <Stack w='100%' gap={0}>
                <Text fz={16} fw={500} mb={4} className='text-black! text-nowrap!'>
                  رقم بديل :
                </Text>
                <Box dir='ltr' className='w-full'>
                  <PhoneInput
                    name='alternative_phone_number'
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry='PS'
                    inputComponent={CustomPhoneInput}
                    placeholder='ادخل رقم بديل...'
                    value={form.getValues().alternative_phone_number as string}
                    {...form.getInputProps('alternative_phone_number')}
                    disabled={isDisplayMode}
                  />
                </Box>
              </Stack>
            )}
          </SimpleGrid>

          {isEditMode && (
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
                rightSection={<UserPen size={16} />}
              >
                حفظ التعديلات
              </Button>
            </Group>
          )}
        </form>
      </Stack>
    </ProfileWrapper>
  );
};

export default ManagerProfileForm;
