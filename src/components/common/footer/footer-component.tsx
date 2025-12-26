'use client';

import { Box, Grid, GridCol, Stack, Text, Divider } from '@mantine/core';
import { FOOTER_TITLE, FOOTER_DESC, FOOTER_COPYRIGHT } from '@/content/common/footer';
import ContactForm from './contact-form';
import FooterContactInfo from './contact-info';

export default function FooterComponent() {
  return (
    <Box
      component='footer'
      // bg='gray.1'
      // py={60}
      pt={40}
      pb={20}
      px={{ base: 20, lg: '6%' }}
      dir='rtl'
      id='contact-us'
    >
      <Grid gutter={48}>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap='md'>
            <Text fw={500} fz={{ base: 16, md: 22 }} c={'primary.9'}>
              {FOOTER_TITLE}
            </Text>

            <Text c='dimmed' lh={1.7} fz={16}>
              {FOOTER_DESC}
            </Text>

            <FooterContactInfo />
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <ContactForm />
        </GridCol>
      </Grid>

      <Divider my={32} />

      <Text size='sm' c='dimmed' ta='center'>
        {FOOTER_COPYRIGHT}
      </Text>
    </Box>
  );
}
