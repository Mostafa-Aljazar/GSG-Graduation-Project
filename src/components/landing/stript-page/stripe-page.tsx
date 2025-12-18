'use client';

import { useDonationStore } from '@/stores/donation-store';
import convertToSubCurrency from '@/utils/convert-to-sub-currency';
import { Badge, Box, Card, Divider, Group, Stack, Text } from '@mantine/core';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './checkout-form';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripePage = () => {
  const { price: amount, name, email, message } = useDonationStore();

  return (
    <Box className='bg-[#F7F2DB] min-h-screen' px={{ base: 16, md: 32 }} py={{ base: 40, md: 60 }}>
      <Card shadow='lg' radius='lg' p='xl' maw={520} mx='auto' className='bg-white'>
        <Stack gap='md'>
          {/* Header */}
          <Stack gap={4} align='center'>
            <Text fz={26} fw={700}>
              Checkout
            </Text>
            <Text fz={14} c='dimmed'>
              راجع تفاصيل تبرعك
            </Text>
          </Stack>

          <Divider />

          {/* Donor info */}
          <Stack gap='xs'>
            <Group justify='space-between'>
              <Text fw={500}>الاسم : </Text>
              <Text c='dimmed'>{name || '-'}</Text>
            </Group>

            <Group justify='space-between'>
              <Text fw={500}>الايميل :</Text>
              <Text c='dimmed'>{email || '-'}</Text>
            </Group>

            <Group justify='space-between'>
              <Text fw={500}>المبلغ :</Text>
              <Badge size='lg' radius='sm' color='green'>
                ${amount}
              </Badge>
            </Group>

            {message && (
              <>
                <Divider my='xs' />
                <Box>
                  <Text fw={500} mb={4}>
                    ملاحظات :
                  </Text>
                  <Text fz={14} c='dimmed' lineClamp={3}>
                    {message}
                  </Text>
                </Box>
              </>
            )}
          </Stack>

          <Divider />

          {/* Stripe form */}
          <Elements
            stripe={stripePromise}
            options={{
              mode: 'payment',
              amount: convertToSubCurrency(amount),
              currency: 'usd',
            }}
          >
            <CheckoutForm amount={amount} />
          </Elements>
        </Stack>
      </Card>
    </Box>
  );
};

export default StripePage;
