'use client';

import { donationFormSchema, TDonationFormType } from '@/validations/landing/donation.schema';
import { Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const DonationForm = () => {
  const form = useForm<TDonationFormType>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      price: 0,
      message: '',
    },
    validate: zod4Resolver(donationFormSchema),
    validateInputOnChange: true,
  });
  const handleSubmit = form.onSubmit((data: TDonationFormType) => {
    console.log(data);
  });
  return (
    <Stack
      w='100%'
      className='bg-[#F7F2DB]'
      justify='center'
      py={40}
      px={{ base: '5%', xl: '10%' }}
    >
      <Text fw={600} fz={40} className='text-center'>
        التبرع الأن
      </Text>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 items-center w-full max-w-[600px] mx-auto'
      >
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
        />
        <TextInput
          label={
            <Text fz={16} fw={500} mb={4} className='text-dark! text-nowrap!'>
              السعر :
            </Text>
          }
          placeholder='ادخل  السعر...'
          size='sm'
          w='100%'
          classNames={{
            input:
              'disabled:cursor-text! bg-white! placeholder:text-sm! text-primary! font-normal!',
          }}
          {...form.getInputProps('price')}
        />
        <Textarea
          label={
            <Text fw={500} fz={16} c='dark'>
              الرسالة :
            </Text>
          }
          w='100%'
          placeholder='أدخل رسالتك...'
          minRows={20}
          {...form.getInputProps('message')}
        />

        <Group justify='center' w={'100%'} mt={20}>
          <Button
            type='submit'
            fullWidth
            size='sm'
            radius='sm'
            fz={16}
            fw={500}
            className='bg-primary! hover:bg-primary/90! text-white! transition-colors'
          >
            التبرع الأن
          </Button>
        </Group>
      </form>
    </Stack>
  );
};

export default DonationForm;
