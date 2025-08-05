
import { getUmkmData, getCurrentUser, getLatestAnnouncement } from "@/server/actions";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Store, Users, FileText, CheckCircle, Award, Annoyed } from "lucide-react";
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
import { format, formatDistanceToNow } from "date-fns";
import { id as indonesiaLocale } from 'date-fns/locale';
import { AnnouncementCard } from "@/components/dashboard/announcement-card";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const latestAnnouncement = await getLatestAnnouncement();
  // Fetch data based on user role - getUmkmData already filters by role internally
  const umkmData = await getUmkmData();

  const totalUmkm = umkmData.length;
  const activeUmkm = umkmData.filter((u) => u.status === "aktif").length;
  const umkmWithNib = umkmData.filter((u) => u.nib).length;
  
  const totalEmployees = umkmData.reduce((sum, u) => sum + u.employeeCount, 0);
  const averageEmployees = totalUmkm > 0 ? (totalEmployees / totalUmkm).toFixed(1) : 0;

  const umkmPerType = umkmData.reduce((acc, umkm) => {
    acc[umkm.businessType] = (acc[umkm.businessType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const umkmPerYear = umkmData
    .filter(u => u.startDate)
    .reduce((acc, umkm) => {
      const year = new Date(umkm.startDate).getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const newestUmkm = umkmData.length > 0 ? umkmData.reduce((latest, current) => {
    // Handle cases where startDate might be invalid
    const latestDate = latest.startDate ? new Date(latest.startDate) : new Date(0);
    const currentDate = current.startDate ? new Date(current.startDate) : new Date(0);
    return latestDate > currentDate ? latest : current;
  }) : null;

  const chartDataPerType = Object.entries(umkmPerType).map(([name, value]) => ({
    name,
    value,
  }));

  const chartDataPerYear = Object.entries(umkmPerYear).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dasbor Utama</h1>
        <p className="text-muted-foreground">
          {currentUser?.role === 'Admin Desa' 
            ? 'Ringkasan statistik dan agregasi data UMKM seluruh desa.' 
            : `Ringkasan statistik UMKM untuk wilayah ${currentUser?.rtRw}.`}
        </p>
      </div>
      
      {latestAnnouncement && (
          <AnnouncementCard announcement={latestAnnouncement} />
      )}

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
         <UmkmPerRtRwChart allData={umkmData} />
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
                                {newestUmkm.startDate ? format(new Date(newestUmkm.startDate), "d MMMM yyyy", { locale: indonesiaLocale }) : 'Tidak diketahui'}
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
