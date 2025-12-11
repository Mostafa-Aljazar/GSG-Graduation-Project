'use client';

import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import {
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import {
  AUTH_ROUTES,
  getDelegateRoutes,
  getDisplacedRoutes,
  getManagerRoutes,
  getSecurityRoutes,
  LANDING_ROUTES,
} from '@/constants/routes';
import { COOKIE_NAME } from '@/constants/cookie-name';
import { USER_RANK_LABELS, USER_TYPE } from '@/constants/user-types';
import useAuth from '@/hooks/useAuth';
import { ILoginResponse } from '@/types/auth/loginResponse.type';
import { loginFormSchema, TLoginFormValues } from '@/validations/auth/login.schema';
import { ILoginProps, login } from '@/actions/auth/login';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import Cookies from 'js-cookie';

export default function LoginComponent() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.replace(LANDING_ROUTES.HOME);
  }, [isAuthenticated, router]);

  const form = useForm<TLoginFormValues>({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '', userType: USER_TYPE.DISPLACED },
    validate: zod4Resolver(loginFormSchema),
  });

  const loginMutation = useMutation<ILoginResponse, Error, ILoginProps>({
    mutationFn: login,
    onSuccess: (data) => {
      form.reset();

      if (data.status === 200) {
        try {
          notifications.show({
            title: 'مرحبا بك',
            message: 'تم تسجيل الدخول بنجاح',
            color: 'grape',
            position: 'top-left',
            withBorder: true,
          });

          if (data.status === 200) {
            // redirect immediately
            const roleRedirects = {
              [USER_TYPE.DISPLACED]: () =>
                router.replace(getDisplacedRoutes({ displacedId: data.user.id }).PROFILE),
              [USER_TYPE.MANAGER]: () =>
                router.replace(getManagerRoutes({ managerId: data.user.id }).PROFILE),
              [USER_TYPE.DELEGATE]: () =>
                router.replace(getDelegateRoutes({ delegateId: data.user.id }).PROFILE),
              [USER_TYPE.SECURITY_PERSON]: () =>
                router.replace(getSecurityRoutes({ securityId: data.user.id }).PROFILE),
            };

            roleRedirects[data.user.role]?.();
          }
        } catch (err) {
          console.error('Error saving session or showing notification', err);
        }

        return;
      }

      throw new Error(data.error || 'فشل في تسجيل الدخول');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message;
      setError(errorMessage);

      notifications.show({
        title: 'خطأ',
        message: errorMessage,
        color: 'red',
        position: 'top-left',
        withBorder: true,
      });
    },
  });

  const handleSubmit = form.onSubmit((values: TLoginFormValues) => {
    setError('');
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      userType: values.userType,
    });
  });

  return (
    <Stack
      align='center'
      gap={40}
      bg={'white'}
      pt={{ base: 0, lg: 64 }}
      pb={20}
      h={'100%'}
      w={{ base: '100%', lg: 550 }}
      pos={'relative'}
      className='rounded-xl!'
    >
      <LoadingOverlay
        visible={loginMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 0.3 }}
      />

      <Text fw={500} fz={{ base: 28, md: 32 }} ta={'center'}>
        تسجيل الدخول
      </Text>

      <form className='flex flex-col items-center gap-3' onSubmit={handleSubmit}>
        <Select
          label={
            <Text fw={400} c={'#817C74'} fz={16}>
              تسجيل الدخول كَ ؟
            </Text>
          }
          data={Object.values(USER_TYPE).map((type) => ({
            label: USER_RANK_LABELS[type],
            value: type,
          }))}
          size='md'
          w={{ base: 343, md: 400 }}
          key={form.key('userType')}
          {...form.getInputProps('userType')}
          classNames={{
            input: 'placeholder:!text-sm !text-primary !font-normal',
            error: '!w-full !text-end !text-[#FD6265] !font-normal !text-sm',
          }}
        />

        <TextInput
          type='email'
          label={
            <Text fw={500} fz={16} mb={3}>
              البريد الاكتروني
            </Text>
          }
          placeholder={'ادخل البريد الاكتروني'}
          size='md'
          w={{ base: 343, md: 400 }}
          key={form.key('email')}
          {...form.getInputProps('email')}
          classNames={{
            input: '!text-dark placeholder:!text-sm !text-primary !font-normal',
            error: '!w-full !text-end !text-[#FD6265] !font-normal !text-sm',
          }}
        />

        <PasswordInput
          type='password'
          label={
            <Text fw={500} fz={16} mb={3}>
              كلمة المرور
            </Text>
          }
          placeholder={'ادخل كلمة المرور'}
          size='md'
          w={{ base: 343, md: 400 }}
          key={form.key('password')}
          {...form.getInputProps('password')}
          classNames={{
            input: '!text-dark placeholder:!text-sm !text-primary !font-normal',
            error: '!w-full !text-end !text-[#FD6265] !font-normal !text-sm',
          }}
        />

        <Group wrap='nowrap' align='center' w={'100%'}>
          <Link href={AUTH_ROUTES.FORGET_PASSWORD} className='font-medium text-primary text-sm'>
            نسيت كلمة المرور ؟
          </Link>
        </Group>

        <Button
          type='submit'
          size='sm'
          fz={18}
          fw={500}
          c={'white'}
          w={228}
          mt={32}
          className={`shadow-lg! max-lg:mt-10! ${
            !form.getValues().password || !form.getValues().email ? 'bg-primary/70!' : 'bg-primary'
          }`}
          disabled={!form.getValues().password || !form.getValues().email}
        >
          دخول
        </Button>

        {error && (
          <Text fw={'500'} mt={'sm'} size='sm' ta='center' c={'red'}>
            {error}
          </Text>
        )}
      </form>
    </Stack>
  );
}
