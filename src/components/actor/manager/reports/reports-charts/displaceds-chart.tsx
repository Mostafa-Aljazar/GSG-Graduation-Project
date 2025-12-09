import { Box, Text } from '@mantine/core';
import BarCharts from '../common/bar-chart';

const sampleData = [
  { name: 'عدد العائلات', pv: 2400 },
  { name: 'عدد النازحين', pv: 1398 },
  { name: 'عدد الخيام', pv: 800 },
  { name: 'عدد كبار السن', pv: 900 },
  { name: 'عدد الأطفال', pv: 100 },
  { name: 'عدد المصابين', pv: 300 },
  { name: 'عدد الحوامل', pv: 800 },
  { name: 'عدد المرضعات', pv: 1800 },
  { name: 'عدد المرضى المزمن', pv: 6800 },
  { name: 'عدد الحالات الحرجة', pv: 800 },
];

const DisplacedsChart = () => {
  return (
    <Box className='border rounded-2xl p-2 border-[#ddd]' p={40}>
      <Text fw={600} fz={20}>
        النازحين
      </Text>
      <BarCharts data={sampleData} dataKey='pv' barColor='#8ea593' backgroundColor='#f2f2f2' />;
    </Box>
  );
};

export default DisplacedsChart;
