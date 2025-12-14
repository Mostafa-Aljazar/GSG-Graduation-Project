'use client';

import { IMG_MAN } from '@/assets/actor';
import ProfileWrapper from '@/components/actor/common/profile-wrapper/profile-wrapper';
import { useUploadThing } from '@/utils/uploadthing/uploadthing';
import { handleUploadMedia } from '@/utils/uploadthing/handleUploadMedia';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState, parseAsStringEnum } from 'nuqs';
import {
  Stack,
  Group,
  SimpleGrid,
  TextInput,
  Textarea,
  NativeSelect,
  Select,
  Button,
  Text,
  FileInput,
  NumberInput,
  Box,
} from '@mantine/core';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import useAuth from '@/hooks/useAuth';
import { ACTION_ADD_EDIT_DISPLAY } from '@/types/common/index.type';
import {
  GENDER,
  GENDER_LABELS,
  SOCIAL_STATUS,
  SOCIAL_STATUS_LABELS,
} from '@/types/actor/common/index.type';
import { USER_RANK, USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import {
  TSecurityProfileFormValues,
  securityProfileFormSchema,
} from '@/validations/actor/securities/profile/security-profile.schema';
import { ISecurityProfileResponse } from '@/types/actor/security/profile/security-profile-response.type';
import { getSecurityProfile } from '@/actions/actor/securities/profile/getSecurityProfile';
import { addNewSecurity } from '@/actions/actor/securities/profile/addNewSecurity';
import { updateSecurityProfile } from '@/actions/actor/securities/profile/updateSecurityProfile';
import { IActionResponse } from '@/types/common/action-response.type';
import { GENERAL_ACTOR_ROUTES } from '@/constants/routes';
import { Save, UserPen } from 'lucide-react';
import { CustomPhoneInput } from '@/components/common/custom/custom-phone-input';

export default function SecurityProfileForm({
  securityId,
  destination,
}: {
  securityId?: string;
  destination?: ACTION_ADD_EDIT_DISPLAY;
}) {
  const queryClient = useQueryClient();

  const { startUpload } = useUploadThing('mediaUploader');
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(IMG_MAN.src);

  const { isManager, isSecurityOfficer } = useAuth();
  // const isOfficer = user?.rank === USER_RANK.SECURITY_OFFICER;

  const router = useRouter();

  const [query, setQuery] = useQueryState(
    'action',
    parseAsStringEnum<ACTION_ADD_EDIT_DISPLAY>(Object.values(ACTION_ADD_EDIT_DISPLAY)).withDefault(
      destination ?? ACTION_ADD_EDIT_DISPLAY.DISPLAY
    )
  );

  const isAddMode = (isManager || isSecurityOfficer) && destination === ACTION_ADD_EDIT_DISPLAY.ADD;
  const isEditMode = (isManager || isSecurityOfficer) && query === ACTION_ADD_EDIT_DISPLAY.EDIT;
  const isDisplayMode =
    query === ACTION_ADD_EDIT_DISPLAY.DISPLAY && destination !== ACTION_ADD_EDIT_DISPLAY.ADD;

  const form = useForm<TSecurityProfileFormValues>({
    mode: 'controlled',
    initialValues: {
      // id: '',
      profileImage: '',
      name: '',
      email: '',
      identity: '',
      nationality: '',
      gender: GENDER.MALE,
      mobileNumber: '',
      alternativeMobileNumber: '',
      role: USER_TYPE.SECURITY_PERSON,
      rank: USER_RANK.SECURITY_PERSON,
      socialStatus: SOCIAL_STATUS.SINGLE,
      additionalNotes: '',
    },
    validate: zod4Resolver(securityProfileFormSchema),
    validateInputOnChange: true,
  });

  const {
    data: securityProfileData,
    isLoading: isLoadingFetch,
    refetch,
  } = useQuery<ISecurityProfileResponse>({
    queryKey: ['security-profile', securityId],
    queryFn: () => getSecurityProfile({ securityId: securityId as string }),
    enabled: isDisplayMode || isEditMode,
  });

  const applyData = ({ securityData }: { securityData: ISecurityProfileResponse | undefined }) => {
    if (!isAddMode && securityData?.user) {
      const u = securityData.user;
      setProfileImage(u.profileImage ?? IMG_MAN.src);

      form.setValues({
        id: u.id,
        name: u.name,
        email: u.email,
        identity: u.identity,
        nationality: u.nationality,
        gender: u.gender,
        mobileNumber: u.mobileNumber,
        alternativeMobileNumber: u.alternativeMobileNumber || undefined,
        role: USER_TYPE.SECURITY_PERSON,
        rank: u.rank,
        socialStatus: u.socialStatus,
        additionalNotes: u.additionalNotes || undefined,
        profileImage: u.profileImage || '',
      });
      form.clearErrors();
      form.resetTouched();
      form.resetDirty();
    }

    if (isAddMode) {
      form.reset();
      setProfileImage(IMG_MAN.src);
    }
  };

  useEffect(() => {
    applyData({ securityData: securityProfileData });
  }, [securityProfileData, isAddMode]);

  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const updateProfileMutation = useMutation<
    IActionResponse,
    Error,
    { securityId: string; payload: TSecurityProfileFormValues }
  >({
    mutationFn: ({ securityId, payload }) => updateSecurityProfile({ securityId, payload }),
    onSuccess: (data) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      notifications.show({
        title: 'تم التحديث',
        message: 'تم تحديث الملف الشخصي للأمن بنجاح',
        color: 'grape',
        position: 'top-left',
        withBorder: true,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['security-profile'] });
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      const errorMessage = error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي للأمن';
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

  const addSecurityMutation = useMutation<
    IActionResponse,
    Error,
    { payload: TSecurityProfileFormValues }
  >({
    mutationFn: ({ payload }) => addNewSecurity({ payload }),
    onSuccess: (data) => {
      notifications.show({
        title: 'تم الإضافة',
        message: 'تم إضافة الأمن الجديد بنجاح',
        color: 'grape',
        position: 'top-left',
        withBorder: true,
      });
      queryClient.invalidateQueries({ queryKey: ['securities'] });
      router.push(GENERAL_ACTOR_ROUTES.SECURITIES);
    },
    onError: (error) => {
      setQuery(ACTION_ADD_EDIT_DISPLAY.DISPLAY);
      const errorMessage = error?.message || 'حدث خطأ أثناء إضافة الأمن الجديد';
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
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = form.onSubmit(async (values: TSecurityProfileFormValues) => {
    const avatarUrl =
      profileImage && profileImage instanceof File
        ? await uploadImages(profileImage)
        : (profileImage as string | null);

    const payload: TSecurityProfileFormValues = {
      ...values,
      profileImage: avatarUrl,
    };

    const handleError = (error: unknown) => {
      const errorMessage = (error as Error)?.message || 'فشل في حفظ الملف الشخصي للأمن';
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
      if (isAddMode) addSecurityMutation.mutate({ payload }, { onError: handleError });
      if (isEditMode && securityId)
        updateProfileMutation.mutate({ securityId, payload }, { onError: handleError });
    } catch (error) {
      handleError(error);
    }
  });

  const isMutationLoading =
    updateProfileMutation.isPending || addSecurityMutation.isPending || uploading;

  return (
    <ProfileWrapper
      mode={isEditMode || isAddMode}
      loading={isLoadingFetch || isMutationLoading || uploading}
      profileImage={profileImage}
      setProfileImage={setProfileImage}
    >
      <Stack my={100}>
        <Group wrap='nowrap' align='center'>
          <Text ta='start' fz={20} fw={600} className='text-primary!'>
            {isAddMode ? 'إضافة عنصر أمن جديد:' : 'البيانات الشخصية:'}
          </Text>
          {isManager && isDisplayMode && (
            <Button
              variant='filled'
              size='xs'
              color='primary'
              type='button'
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
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  رقم الهوية :
                </Text>
              }
              type='number'
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
              data={Object.entries(GENDER).map(([_, value]) => ({
                value,
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
              data={Object.entries(SOCIAL_STATUS).map(([_, value]) => ({
                value,
                label: SOCIAL_STATUS_LABELS[value],
              }))}
              size='sm'
              w='100%'
              classNames={{
                input:
                  'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
              }}
              {...form.getInputProps('socialStatus')}
              disabled={isDisplayMode}
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
            {/* <NumberInput
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
              defaultValue={isEditMode ? securityProfileData?.user. : 0}
              allowDecimal={false}
              key={form.key('age')}
              {...form.getInputProps('age')}
              disabled={isDisplayMode}
            /> */}
            {isDisplayMode && (
              <TextInput
                label={
                  <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                    الرتبة :
                  </Text>
                }
                size='sm'
                w='100%'
                value={USER_RANK_LABELS[securityProfileData?.user.rank as USER_RANK]}
                // {...form.getInputProps('rank')}
                disabled={isDisplayMode}
                classNames={{
                  input:
                    'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
                }}
              />
            )}
            {!isDisplayMode && (
              <NativeSelect
                label={
                  <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                    الرتبة :
                  </Text>
                }
                data={Object.entries([USER_RANK.SECURITY_PERSON, USER_RANK.SECURITY_OFFICER]).map(
                  ([_, value]) => ({
                    value,
                    label: USER_RANK_LABELS[value],
                  })
                )}
                size='sm'
                w='100%'
                classNames={{
                  input:
                    'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
                }}
                {...form.getInputProps('rank')}
                disabled={isDisplayMode}
              />
            )}
            {/* <TextInput
              label={
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
                  الدور :
                </Text>
              }
              placeholder='ادخل الدور...'
              size='sm'
              w='100%'
              {...form.getInputProps('role')}
              disabled={isDisplayMode}
            /> */}
            <Stack w='100%' gap={0}>
              <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
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
            {(isEditMode || isAddMode || securityProfileData?.user.alternativeMobileNumber) && (
              <Stack w='100%' gap={0}>
                <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
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

          {(isEditMode || isAddMode) && (
            <Group justify='center' w='100%' mt={20}>
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
