"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Jumlah UMKM Baru",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


type ChartData = {
    name: string; // Year
    value: number;
}[];

export function UmkmPerYearChart({ data }: { data: ChartData }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Pertumbuhan UMKM per Tahun</CardTitle>
        <CardDescription>
          Jumlah UMKM baru yang didirikan setiap tahunnya.
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
            />
            <YAxis />
            <Tooltip
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
