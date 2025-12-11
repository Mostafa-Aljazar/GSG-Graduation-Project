'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button, PinInput, Stack, Text, Group, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AlertCircle, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { forgetPassword, IForgetPasswordProps } from '@/actions/auth/forgetPassword';
import { AUTH_ROUTES } from '@/constants/routes';
import { IActionResponse } from '@/types/common/action-response.type';
import { otpFormSchema, TOtpFormValues } from '@/validations/auth/otp.schema';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { IVerifyOtpProps, verifyOtp } from '@/actions/auth/verifyOtp';

export default function OTPComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}

function OTPContent() {
  const router = useRouter();

  const [query, setQuery] = useQueryStates(
    {
      email: parseAsString.withDefault(''),
      callback: parseAsString.withDefault('/'),
      date: parseAsInteger.withDefault(0),
      otp: parseAsString.withDefault(''),
    },
    { shallow: true }
  );

  // Lazy initialize date if not set
  useEffect(() => {
    if (!query.date) {
      setQuery({ date: Date.now() });
    }
  }, [query.date, setQuery]);

  // Redirect if query is invalid
  useEffect(() => {
    if (!query.email || !query.callback || !query.date) {
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [query, router]);

  // Lazy initialize seconds from query.date
  const [seconds, setSeconds] = useState(() =>
    query.date ? Math.max(60 - Math.floor((Date.now() - query.date) / 1000), 0) : 60
  );

  // Update seconds asynchronously when query.date changes
  useEffect(() => {
    if (!query.date) return;
    const handle = setTimeout(() => {
      setSeconds(Math.max(60 - Math.floor((Date.now() - query.date) / 1000), 0));
    }, 0);
    return () => clearTimeout(handle);
  }, [query.date]);

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;

  const [error, setError] = useState('');

  const form = useForm<TOtpFormValues>({
    mode: 'uncontrolled',
    initialValues: { otp: query.otp },
    validate: zod4Resolver(otpFormSchema),
  });

  const verifyOtpMutation = useMutation<IActionResponse, Error, IVerifyOtpProps>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: data.message || 'تم التحقق من الرمز بنجاح',
          message: 'قم بتعيين كلمة مرور جديدة',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
          loading: true,
        });
        router.push(`${query.callback}?email=${query.email}`);
        form.reset();
        setError('');
      } else {
        const errorMessage = data.error || 'رمز التحقق غير صالح';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
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

  // useEffect(() => {
  //   if (query.otp !== '') {
  //     verifyOtpMutation.mutate({ email: query.email, otp: query.otp });
  //   }
  // }, [query.otp]);

  const handleSubmit = form.onSubmit((values: TOtpFormValues) => {
    if (!seconds) {
      setError('انتهى وقت الرمز. يرجى طلب رمز جديد');
      return;
    }
    if (values.otp.length !== 4) {
      setError('يجب إدخال 4 أرقام');
      return;
    }
    setError('');
    verifyOtpMutation.mutate({ email: query.email, otp: values.otp });
  });

  const resendOtpMutation = useMutation<IActionResponse, Error, IForgetPasswordProps>({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      if (data.status === 200) {
        notifications.show({
          title: 'تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني',
          message: 'قم بالتحقق من بريدك الإلكتروني مرة أخرى',
          color: 'grape',
          position: 'top-left',
          withBorder: true,
          loading: true,
        });

        const newDate = Date.now();
        setQuery({ date: newDate });
        setSeconds(60);
        form.reset();
        setError('');
      } else {
        const errorMessage = data.error || 'فشل في إرسال رمز التحقق';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
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

  const handleResend = () => {
    setError('');
    resendOtpMutation.mutate({ email: query.email });
  };

  return (
    <Stack
      align='center'
      gap={40}
      bg='white'
      pt={{ base: 0, lg: 64 }}
      pb={20}
      h='100%'
      w={{ base: '100%', lg: 550 }}
      className='rounded-xl!'
      pos='relative'
    >
      <LoadingOverlay
        visible={verifyOtpMutation.isPending || resendOtpMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 0.3 }}
      />

      <Text fw={500} fz={{ base: 28, md: 32 }} ta='center'>
        إدخال رمز التحقق
      </Text>

      <Stack justify='center' align='center' gap={20}>
        <Text fw={500} fz={16} c='#817C74' ta='center' w={{ base: 343, md: 400 }}>
          لقد أرسلنا رمز التحقق إلى <br />
          <span className='font-bold'>{query.email}</span>
        </Text>

        <form className='flex flex-col items-center gap-0' onSubmit={handleSubmit}>
          <PinInput
            disabled={verifyOtpMutation.isPending || resendOtpMutation.isPending || seconds === 0}
            type='number'
            size='md'
            length={4}
            placeholder=''
            classNames={{
              root: 'gap-5',
              input: 'border-1 border-[#DFDEDC] w-12 h-12 rounded-lg focus:border-primary',
            }}
            key={form.key('otp')}
            {...form.getInputProps('otp')}
            autoFocus
          />

          {!seconds && (
            <Group align='center' gap={8} mt={10} c='#FD6265'>
              <AlertCircle size={18} />
              <Text fw={500} fz={15}>
                انتهى وقت الرمز
              </Text>
            </Group>
          )}

          {seconds > 0 && (
            <Group
              align='center'
              justify='center'
              mt={20}
              className='px-2 py-1 border border-[#5F6F52] rounded-lg'
              c='#5F6F52'
            >
              <Timer size={16} />
              <Text fw={400} fz={14}>
                {timeDisplay}
              </Text>
            </Group>
          )}

          {!seconds && (
            <Button
              variant='transparent'
              mt={20}
              fz={16}
              fw={500}
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className='text-primary! hover:text-primary/80! underline!'
            >
              إعادة إرسال الرمز
            </Button>
          )}

          <Button
            type='submit'
            mt={32}
            fz={20}
            fw={500}
            c='white'
            className={`shadow-lg! max-lg:mt-10! ${
              !seconds || form.getValues().otp.length !== 4
                ? 'bg-primary/70!'
                : 'bg-primary! hover:bg-primary/90!'
            }`}
            w={228}
            disabled={!seconds || form.getValues().otp.length !== 4 || verifyOtpMutation.isPending}
          >
            تحقق
          </Button>

          {error && (
            <Text fw={500} mt='sm' size='sm' ta='center' c='red'>
              {error}
            </Text>
          )}
        </form>
      </Stack>
    </Stack>
  );
}
