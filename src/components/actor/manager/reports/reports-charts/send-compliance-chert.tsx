import { Box, Group, Stack, Text } from '@mantine/core';
import PieCharts from '../common/pie-chart';

const SendComplianceChart = () => {
  const sampleData = [
    { name: 'تمت قرائتها', value: 400 },
    { name: 'الرسائل المرسلة', value: 300 },
    { name: 'قيد المراجعة', value: 300 },
  ];

  const colors = ['#345e40', '#597b62', '#ddd'];
  return (
    <Stack className='border border-[#ddd] rounded-2xl p-4 w-full lg:max-w-[500px]' w={'100%'}>
      <Text fw={600} fz={20}>
        الشكاوي المرسلة
      </Text>
      <Group justify='space-between' align='center' w='100%'>
        {/* Pie Chart */}
        <Box style={{ flex: 1 }}>
          <PieCharts
            data={sampleData}
            colors={colors}
            maxWidth='250px' maxHeight='250px'
            innerRadius={60}
          />
        </Box>

        {/* Custom Legend */}
        <Stack>
          {sampleData.map((item, index) => (
            <Group key={item.name} align='center'>
              <Box
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: 4,
                }}
              />
              <Text>{item.name}</Text>
            </Group>
          ))}
        </Stack>
      </Group>
    </Stack>
  );
};

export default SendComplianceChart;
