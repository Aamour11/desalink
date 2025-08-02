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
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">UMKM per RT/RW</CardTitle>
        <CardDescription>
          Jumlah Usaha Mikro, Kecil, dan Menengah di setiap wilayah RT/RW
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `RT/RW ${value}`}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
