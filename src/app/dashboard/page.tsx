import { mockUmkm } from "@/lib/data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Store, Users, FileText, CheckCircle } from "lucide-react";
import { UmkmPerTypeChart } from "@/components/dashboard/umkm-per-type-chart";
import { UmkmPerRtRwChart } from "@/components/dashboard/umkm-per-rtrw-chart";
import { AISummary } from "@/components/dashboard/ai-summary";

export default function DashboardPage() {
  const totalUmkm = mockUmkm.length;
  const activeUmkm = mockUmkm.filter((u) => u.status === "aktif").length;
  const umkmWithNib = mockUmkm.filter((u) => u.nib).length;
  const umkmPerType = mockUmkm.reduce((acc, umkm) => {
    acc[umkm.businessType] = (acc[umkm.businessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const umkmPerRtRw = mockUmkm.reduce((acc, umkm) => {
    acc[umkm.rtRw] = (acc[umkm.rtRw] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataPerType = Object.entries(umkmPerType).map(([name, value]) => ({
    name,
    value,
  }));
  const chartDataPerRtRw = Object.entries(umkmPerRtRw).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan statistik UMKM Desa X</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total UMKM"
          value={totalUmkm}
          icon={<Store className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="UMKM Aktif"
          value={activeUmkm}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Memiliki NIB"
          value={umkmWithNib}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Karyawan"
          value={mockUmkm.reduce((sum, u) => sum + u.employeeCount, 0)}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <UmkmPerRtRwChart data={chartDataPerRtRw} />
        </div>
        <div className="lg:col-span-2">
            <UmkmPerTypeChart data={chartDataPerType} />
        </div>
      </div>
      
      <AISummary 
        totalUmkm={totalUmkm}
        umkmPerRtRw={umkmPerRtRw}
        umkmPerType={umkmPerType}
      />

    </div>
  );
}
