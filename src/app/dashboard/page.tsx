import { mockUmkm } from "@/lib/data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Store, Users, FileText, CheckCircle, TrendingUp, Building, Award } from "lucide-react";
import { UmkmPerTypeChart } from "@/components/dashboard/umkm-per-type-chart";
import { UmkmPerRtRwChart } from "@/components/dashboard/umkm-per-rtrw-chart";
import { UmkmPerYearChart } from "@/components/dashboard/umkm-per-year-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { id as indonesiaLocale } from 'date-fns/locale';

export default function DashboardPage() {
  const totalUmkm = mockUmkm.length;
  const activeUmkm = mockUmkm.filter((u) => u.status === "aktif").length;
  const umkmWithNib = mockUmkm.filter((u) => u.nib).length;
  
  const totalEmployees = mockUmkm.reduce((sum, u) => sum + u.employeeCount, 0);
  const averageEmployees = totalUmkm > 0 ? (totalEmployees / totalUmkm).toFixed(1) : 0;

  const umkmPerType = mockUmkm.reduce((acc, umkm) => {
    acc[umkm.businessType] = (acc[umkm.businessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const umkmPerRtRw = mockUmkm.reduce((acc, umkm) => {
    acc[umkm.rtRw] = (acc[umkm.rtRw] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const umkmPerYear = mockUmkm
    .filter(u => u.startDate)
    .reduce((acc, umkm) => {
      const year = new Date(umkm.startDate).getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const newestUmkm = mockUmkm.length > 0 ? mockUmkm.reduce((latest, current) => {
    return new Date(latest.startDate) > new Date(current.startDate) ? latest : current;
  }) : null;

  const chartDataPerType = Object.entries(umkmPerType).map(([name, value]) => ({
    name,
    value,
  }));
  const chartDataPerRtRw = Object.entries(umkmPerRtRw).map(
    ([name, value]) => ({ name, value })
  );
  const chartDataPerYear = Object.entries(umkmPerYear).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dasbor Utama</h1>
        <p className="text-muted-foreground">Ringkasan statistik dan agregasi data UMKM Desa Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total UMKM"
          value={totalUmkm}
          icon={<Store className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="UMKM Aktif"
          value={activeUmkm}
          icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Memiliki NIB"
          value={umkmWithNib}
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Rata-rata Karyawan"
          value={averageEmployees}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <UmkmPerRtRwChart data={chartDataPerRtRw} />
         <UmkmPerTypeChart data={chartDataPerType} />
      </div>

       <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <UmkmPerYearChart data={chartDataPerYear} />
        </div>
        <div className="lg:col-span-2">
           <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    UMKM Terbaru
                </CardTitle>
                <CardDescription>UMKM yang paling baru terdaftar di sistem.</CardDescription>
              </CardHeader>
              <CardContent>
                {newestUmkm ? (
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg text-primary">{newestUmkm.businessName}</h3>
                        <p className="text-sm text-muted-foreground">
                            Oleh: <span className="font-medium text-foreground">{newestUmkm.ownerName}</span>
                        </p>
                         <p className="text-sm text-muted-foreground">
                            Jenis: <span className="font-medium text-foreground">{newestUmkm.businessType}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tanggal Berdiri: <span className="font-medium text-foreground">
                                {format(new Date(newestUmkm.startDate), "d MMMM yyyy", { locale: indonesiaLocale })}
                            </span>
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        Tidak ada data UMKM.
                    </p>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
