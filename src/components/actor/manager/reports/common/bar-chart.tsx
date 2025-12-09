'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface IBarCharts {
  data: Record<string, any>[];
  dataKey: string;
  nameKey?: string;
  barColor?: string;
  backgroundColor?: string;
  showGrid?: boolean;
  height?: number | string;
}

const BarCharts = ({
  data,
  dataKey,
  nameKey = 'name',
  barColor = '#8ea593',
  backgroundColor = '#eee',
  showGrid = true,
  height = '50vh',
}: IBarCharts) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{
            top: 25,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray='3 3' />}
          <XAxis dataKey={nameKey} height={60} />
          <YAxis />
          <Bar
            dataKey={dataKey}
            fill={barColor}
            background={{ fill: backgroundColor }}
            barSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
