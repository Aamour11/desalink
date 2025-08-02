"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "UMKM",
  },
  Kuliner: {
    label: "Kuliner",
    color: "hsl(var(--chart-1))",
  },
  Fashion: {
    label: "Fashion",
    color: "hsl(var(--chart-2))",
  },
  Kerajinan: {
    label: "Kerajinan",
    color: "hsl(var(--chart-3))",
  },
  Jasa: {
    label: "Jasa",
    color: "hsl(var(--chart-4))",
  },
  Pertanian: {
    label: "Pertanian",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

type ChartData = {
  name: string;
  value: number;
  fill: string;
}[];

export function UmkmPerTypeChart({ data: rawData }: { data: {name: string, value: number}[] }) {
    const totalValue = rawData.reduce((acc, item) => acc + item.value, 0);

    const chartData = React.useMemo(() => {
        const colors = Object.values(chartConfig).map(c => c.color).filter(Boolean) as string[];
        return rawData.map((item, index) => ({
            ...item,
            fill: colors[index % colors.length]
        }))
    }, [rawData]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="font-headline">UMKM per Jenis Usaha</CardTitle>
        <CardDescription>
          Distribusi Usaha Mikro, Kecil, dan Menengah
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total {totalValue} UMKM terdata <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan sebaran jenis usaha di desa
        </div>
      </CardFooter>
    </Card>
  );
}
