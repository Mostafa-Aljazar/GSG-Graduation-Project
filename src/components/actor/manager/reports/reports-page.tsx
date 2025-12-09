import { Box, Group, Stack, Text } from '@mantine/core';
import DisplacedsChart from './reports-charts/displaceds-chart';
import KidsAgeChart from './reports-charts/kids-age-chart';
import ReceiveComplianceChart from './reports-charts/recieve-compliance-chart';
import SendComplianceChart from './reports-charts/send-compliance-chert';

const ReportsPage = () => {
  return (
    <Box pos={'relative'} p={20}>
      <Group justify='space-between' align='center' w='100%'>
        <Text fw={600} fz={22} className='text-nowrap! text-primary!'>
          التقارير
        </Text>
      </Group>
      <Stack gap='xl' w='100%' pt={20}>
        <DisplacedsChart />
        <Group align='center' w='100%' className='flex-row' >
          <KidsAgeChart />
          <SendComplianceChart />
          <ReceiveComplianceChart />
        </Group>
      </Stack>
    </Box>
  );
};

export default ReportsPage;
