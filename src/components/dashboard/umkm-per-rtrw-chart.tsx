
"use client";

import React, { useState, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UMKM } from "@/lib/types";

const chartConfig = {
  value: {
    label: "Jumlah UMKM",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ChartData = {
    name: string;
    value: number;
};

export function UmkmPerRtRwChart({ allData }: { allData: UMKM[] }) {
  const [selectedRw, setSelectedRw] = useState("all");

  const allRws = useMemo(() => {
    const rws = new Set(allData.map(umkm => umkm.rtRw.split('/')[1]));
    return Array.from(rws).sort((a, b) => parseInt(a) - parseInt(b));
  }, [allData]);

  const chartData = useMemo(() => {
    if (selectedRw === "all") {
      // Aggregate by RW
      const dataByRw = allData.reduce((acc, umkm) => {
        const rw = `RW ${umkm.rtRw.split('/')[1]}`;
        acc[rw] = (acc[rw] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(dataByRw).map(([name, value]) => ({ name, value }))
        .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    } else {
      // Aggregate by RT within the selected RW
      const dataByRt = allData
        .filter(umkm => umkm.rtRw.split('/')[1] === selectedRw)
        .reduce((acc, umkm) => {
          const rt = `RT ${umkm.rtRw.split('/')[0]}`;
          acc[rt] = (acc[rt] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      return Object.entries(dataByRt).map(([name, value]) => ({ name, value }))
        .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    }
  }, [allData, selectedRw]);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">UMKM per Wilayah</CardTitle>
            <CardDescription>
                Jumlah UMKM per {selectedRw === 'all' ? 'RW' : `RT di RW ${selectedRw}`}
            </CardDescription>
        </div>
        <Select value={selectedRw} onValueChange={setSelectedRw}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih RW" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua RW</SelectItem>
                {allRws.map(rw => (
                    <SelectItem key={rw} value={rw}>RW {rw}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
