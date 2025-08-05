
"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Jumlah UMKM",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ChartData = {
    name: string;
    value: number;
}[];

export function UmkmPerRtRwChart({ data }: { data: ChartData }) {
  // Increase height based on data length for better readability
  const chartHeight = Math.max(300, data.length * 35);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">UMKM per Wilayah</CardTitle>
        <CardDescription>
          Jumlah Usaha Mikro, Kecil, dan Menengah di setiap wilayah RT/RW
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: `${chartHeight}px` }}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `RT/RW ${value}`}
              className="text-xs"
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="value" layout="vertical" fill="var(--color-value)" radius={4}>
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
