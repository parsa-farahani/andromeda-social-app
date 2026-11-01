'use client'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";


type Point = {
   date: string;
   count: number;
   count2?: number;
};




const DailyChart = (
   {
      data,
      label = "Count",
      label2 = "Count 2",
     lineColor = "var(--chart-1)",
      lineColor2 = "var(--chart-2)",
      allowDecimalsY = true,

   }: {
      data: Point[];
      label?: string;
      label2?: string;
      lineColor?: string;
      lineColor2?: string;
      allowDecimalsY?: boolean; 
   }
) => {

   const chartConfig = {
      count: { label, color: lineColor },
      count2: { label: label2, color: lineColor2 },
   } satisfies ChartConfig;

   const hasSecond = data.some((d) => d.count2 !== undefined);

  return (
    <ChartContainer
      config={chartConfig}
      className='min-h-60 w-full aspect-auto h-72'
    >
      <LineChart
         data={data}
         margin={{
            left: 0,
            right: 0,
         }}
         
      >
         <CartesianGrid vertical={false} />
         <XAxis
            dataKey="date"
            tickLine={false}
         
         />
         <YAxis
            // dataKey="count"
            tickLine={false}
            allowDecimals={allowDecimalsY}
         />
         <ChartTooltip
            content={ <ChartTooltipContent labelFormatter={(v) => `${v}`} /> }
         />
         {/* <Bar
            dataKey="count"
            fill="var(--color-reg-count"
            radius={4}
         /> */}
         <Line
            type="monotone"
            dataKey="count"  
            stroke={lineColor || "var(--color-reg-count)"}
            strokeWidth={2}
         />
         {
            (hasSecond)
            && (
               <Line
                  type="monotone"
                  dataKey="count2"  
                  stroke={lineColor2 || "var(--color-reg-count)"}
                   strokeWidth={2}
               />
            )
         }
      </LineChart>
    </ChartContainer>
  )
}

export default DailyChart