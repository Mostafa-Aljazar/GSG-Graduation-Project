'use client';

import { Box, Stack, Text, Divider, Flex } from '@mantine/core';
import { FOOTER_COPYRIGHT, FOOTER_DESC, FOOTER_TITLE } from '@/content/common/footer';
import Footer_Contact_Info from '@/components/common/footer/contact-info';
import Footer_Form from '@/components/common/footer/contact-form';

export default function FooterComponent() {
  return (
    <Box
      component='footer'
      c='white'
      pos='relative'
      pt={20}
      pb={20}
      style={{ borderTop: '1px solid #e5e7eb' }}
      w='100%'
      px={{ base: 20, lg: '5%' }}
      ta='right'
      id='contact-us'
    >
      <Text fw={600} fz={22} mb={8} className='text-primary!'>
        {FOOTER_TITLE}
      </Text>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        wrap='nowrap'
        justify='space-between'
        w={'100%'}
        gap={{ base: 20, md: '5%' }}
      >
        <Stack justify='space-between' w={{ base: '100%', lg: '80%' }} h='100%'>
          <Text c='dark' fz={15} fw={500} mb={16}>
            {FOOTER_DESC}
          </Text>
          <Footer_Contact_Info className='hidden! md:block!' />
        </Stack>

        <Footer_Form />
      </Flex>

      <Footer_Contact_Info className='px-3! pt-7! md:hidden! block!' />

      <Divider w={'100%'} my={20} className='bg-gray-300! shrink-0' />

      <Text fz='sm' c={'gray'} ta={'right'}>
        {FOOTER_COPYRIGHT}
      </Text>
    </Box>
  );
}
