'use client';

import { FC } from 'react';
import { Cell, Pie, PieChart, PieLabelRenderProps } from 'recharts';

interface IPieCharts {
  data: { name: string; value: number }[];
  dataKey?: string;
  colors?: string[];
  maxWidth?: number | string;
  maxHeight?: number | string;
  aspectRatio?: number;
  isAnimationActive?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

const RADIAN = Math.PI / 180;

const PieCharts: FC<IPieCharts> = ({
  data,
  dataKey = 'value',
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
  maxWidth = '500px',
  maxHeight = '80vh',
  aspectRatio = 1,
  isAnimationActive = true,
  innerRadius,
  outerRadius = 100,
}) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelRenderProps) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > ncx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart
      style={{
        width: '100%',
        maxWidth,
        maxHeight,
        aspectRatio,
      }}
      responsive
    >
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey={dataKey}
        isAnimationActive={isAnimationActive}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieCharts;
