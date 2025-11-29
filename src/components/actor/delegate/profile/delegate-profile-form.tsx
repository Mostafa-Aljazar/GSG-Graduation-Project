'use client';

import { IMG_MAN } from '@/assets/actor';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import {
  Box,
  Button,
  Group,
  NativeSelect,
  NumberInput,
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

import {
  addNewDelegate,
  addNewDelegateProps,
} from '@/actions/actors/delegates/profile/addNewDelegate';
import { getDelegateProfile } from '@/actions/actors/delegates/profile/getDelegateProfile';
import {
  updateDelegateProfile,
  UpdateDelegateProfileProps,
} from '@/actions/actors/delegates/profile/updateProfileInfo';
import { CustomPhoneInput } from '@/components/common/custom/custom-phone-input';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import useAuth from '@/hooks/useAuth';
import {
  ACTION_ADD_EDIT_DISPLAY,
  GENDER,
  GENDER_LABELS,
  SOCIAL_STATUS,
  SOCIAL_STATUS_LABELS,
} from '@/types/common/actors-information.type';
import { DelegateProfileResponse } from '@/types/delegate/profile/delegate-profile-response.type';
import { handleUploadMedia } from '@/utils/uploadthing/handleUploadMedia';
import {
  DelegateProfileSchema,
  DelegateProfileSchemaType,
} from '@/validations/actor/delegate/delegate-profile-schema';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Save, UserPen } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DelegateProfileForm = ({
  delegateId,
  destination,
}: {
  delegateId?: number;
  destination?: ACTION_ADD_EDIT_DISPLAY;
}) => {
  const queryClient = useQueryClient();

  const { startUpload } = useUploadThing('mediaUploader');
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(IMG_MAN.src);

  const { isDelegate, isManager, user } = useAuth();
  const isOwner = isDelegate && user?.id === delegateId;

  const router = useRouter();

  const [query, setQuery] = useQueryState(
    'action',
    parseAsStringEnum<ACTION_ADD_EDIT_DISPLAY>(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      destination ?? ACTION_ADD_EDIT_DISPLAY.DISPLAY
    )
  );

  const isAddMode = isManager && destination == ACTION_ADD_EDIT_DISPLAY.ADD;
  const isEditMode = (isManager || isOwner) && query === ACTION_ADD_EDIT_DISPLAY.EDIT;
  const isDisplayMode =
    query === ACTION_ADD_EDIT_DISPLAY.DISPLAY && destination !== ACTION_ADD_EDIT_DISPLAY.ADD;

  const form = useForm<DelegateProfileSchemaType>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      gender: GENDER.MALE,
      social_status: SOCIAL_STATUS.SINGLE,
      identity: '',
      nationality: '',
      email: '',
      age: 0,
      education: '',
      phone_number: '',
      alternative_phone_number: '',
    },
    validate: zod4Resolver(DelegateProfileSchema),
    validateInputOnChange: true,
  });

  const {
    data: delegateProfileData,
    isLoading: isLoadingFetch,
    refetch,
  } = useQuery<DelegateProfileResponse>({
    queryKey: ['delegate-profile', delegateId],
    queryFn: () => getDelegateProfile({ delegate_Id: delegateId as number }),
    enabled: isDisplayMode || isEditMode,
  });

  const applyData = ({ delegateData }: { delegateData: DelegateProfileResponse | undefined }) => {
    if (!isAddMode && delegateData) {
      if (delegateData.status === 200 && delegateData.user) {
        const userData = delegateData.user;

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
          age: userData.age,
          education: userData.education,
        });
        form.clearErrors();
        form.resetTouched();
        form.resetDirty();
      } else {
        notifications.show({
          title: 'خطأ',
          message: delegateData.error || 'فشل في تحميل بيانات الملف الشخصي للمندوب',
          color: 'red',
          position: 'top-left',
          withBorder: true,
        });
      }
    }

    if (isAddMode) {
      form.reset();
      setProfileImage(IMG_MAN.src);
    }
  };

  useEffect(() => {
    applyData({ delegateData: delegateProfileData });
  }, [delegateProfileData, isAddMode]);

  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const updateProfileMutation = useMutation<
    DelegateProfileResponse,
    Error,
    UpdateDelegateProfileProps
  >({
    mutationFn: updateDelegateProfile,
    onSuccess: (data) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      if (data.status === 200) {
        notifications.show({
          title: 'تم التحديث',
          message: 'تم تحديث الملف الشخصي للمندوب بنجاح',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });

        applyData({ delegateData: data });
        refetch();
        queryClient.invalidateQueries({ queryKey: ['delegate-profile'] });
      } else {
        throw new Error(data.error || 'فشل في تحديث الملف الشخصي للمندوب');
      }
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);

      const errorMessage = error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي للمندوب';
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

  const addDelegateMutation = useMutation<DelegateProfileResponse, Error, addNewDelegateProps>({
    mutationFn: addNewDelegate,
    onSuccess: (data) => {
      if (data.status === 201) {
        notifications.show({
          title: 'تم الإضافة',
          message: 'تم إضافة المندوب الجديد بنجاح',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
        });

        queryClient.invalidateQueries({ queryKey: ['delegates'] });
        router.push(GENERAL_ACTOR_ROUTES.DELEGATES);
      } else {
        throw new Error(data.error || 'فشل في إضافة المندوب الجديد');
      }
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);

      const errorMessage = error?.message || 'حدث خطأ أثناء إضافة المندوب الجديد';
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

  const handleSubmit = form.onSubmit(async (values: DelegateProfileSchemaType) => {
    const avatarUrl =
      profileImage && profileImage instanceof File
        ? await uploadImages(profileImage)
        : (profileImage as string | null);

    const payload: DelegateProfileSchemaType = {
      ...values,
      profile_image: avatarUrl,
    };
    console.log('🚀 ~ Delegate_Profile_Form ~ payload:', payload);

    const handleError = (error: unknown) => {
      const errorMessage = (error as Error)?.message || 'فشل في حفظ الملف الشخصي للمندوب';
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
        addDelegateMutation.mutate({ payload }, { onError: handleError });
      }
      if (isEditMode) {
        updateProfileMutation.mutate(
          { delegate_Id: delegateId as number, payload },
          { onError: handleError }
        );
      }
    } catch (error) {
      handleError(error);
    }
  });

  const isMutationLoading = updateProfileMutation.isPending || addDelegateMutation.isPending;

  return (
    <ProfileWrapper
      mode={isEditMode || isAddMode}
      loading={isLoadingFetch || isMutationLoading || uploading}
    >
      <Stack my={100}>
        <Group wrap='nowrap' align='center'>
          <Text ta='start' fz={20} fw={600} className='text-primary!'>
            {isAddMode ? 'إضافة مندوب جديد:' : 'البيانات الشخصية:'}
          </Text>
          {isManager && isDisplayMode && (
            <Button
              variant='filled'
              size='xs'
              color='primary'
              type='submit'
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
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-full'>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} verticalSpacing='sm' w='100%'>
            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  الاسم :
                </Text>
              }
              placeholder='ادخل الاسم...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('name')}
              disabled={isDisplayMode}
            />

            <TextInput
              type='number'
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  رقم الهوية :
                </Text>
              }
              placeholder='ادخل رقم الهوية...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('identity')}
              disabled={isDisplayMode}
            />

            <NativeSelect
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  الجنس :
                </Text>
              }
              data={Object.entries(GENDER).map(([key, value]) => ({
                value: value,
                label: GENDER_LABELS[value],
              }))}
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('gender')}
              disabled={isDisplayMode}
            />

            <NativeSelect
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  الحالة الاجتماعية :
                </Text>
              }
              data={Object.entries(SOCIAL_STATUS).map(([key, value]) => ({
                value: value,
                label: SOCIAL_STATUS_LABELS[value],
              }))}
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('social_status')}
              disabled={isDisplayMode}
              // className='font-normal'
            />

            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  الجنسية :
                </Text>
              }
              placeholder='ادخل الجنسية...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('nationality')}
              disabled={isDisplayMode}
            />

            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  البريد الإلكتروني :
                </Text>
              }
              type='email'
              placeholder='example@gmail.com'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('email')}
              disabled={isDisplayMode}
            />

            <NumberInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  العمر :
                </Text>
              }
              placeholder='ادخل العمر...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              // min={18}
              // max={100}
              defaultValue={isEditMode ? delegateProfileData?.user.age : 0}
              allowDecimal={false}
              key={form.key('age')}
              {...form.getInputProps('age')}
              disabled={isDisplayMode}
            />

            <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  المؤهل العلمي :
                </Text>
              }
              placeholder='ادخل المؤهل العلمي...'
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('education')}
              disabled={isDisplayMode}
            />

            <Stack w='100%' gap={0}>
              <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
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
              isAddMode ||
              (delegateProfileData?.user.alternative_phone_number &&
                delegateProfileData.user.alternative_phone_number !== '')) && (
              <Stack w='100%' gap={0}>
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
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

            {!isAddMode && !isEditMode && (
              <TextInput
                label={
                  <Text fz={16} fw={500} mb={4}>
                    عدد المخيمات المسؤولة :
                  </Text>
                }
                value={delegateProfileData?.user.number_of_responsible_camps || 0}
                classNames={{
                  input:
                    'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
                }}
                size='sm'
                w='100%'
                disabled
              />
            )}

            {!isAddMode && !isEditMode && (
              <TextInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                    عدد العائلات :
                  </Text>
                }
                classNames={{
                  input:
                    'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
                }}
                value={delegateProfileData?.user.number_of_families || 0}
                size='sm'
                w='100%'
                disabled
              />
            )}
          </SimpleGrid>

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
};

export default DelegateProfileForm;
