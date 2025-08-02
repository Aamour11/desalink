

"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, BellRing, UserCog, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function AdminCenterPage() {
    const { toast } = useToast();
    const currentUser = useCurrentUser();
    
    if (currentUser?.role !== "Admin Desa") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Ban className="h-20 w-20 text-destructive mb-4" />
                <h1 className="font-headline text-3xl font-bold">Akses Ditolak</h1>
                <p className="text-muted-foreground mt-2">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                 <Button asChild className="mt-6">
                    <Link href="/dashboard">Kembali ke Dashboard</Link>
                </Button>
            </div>
        )
    }

    const handleBackup = () => {
        toast({
            title: "Proses Dimulai",
            description: "Mencadangkan data sistem... Ini mungkin memerlukan beberapa saat.",
        });
        setTimeout(() => {
            toast({
                title: "Sukses!",
                description: "Cadangan data UMKM dan pengguna berhasil dibuat.",
            });
        }, 2000);
    }

    const handleNotify = () => {
        toast({
            title: "Mengirim Notifikasi",
            description: "Pengumuman sedang dikirim ke semua petugas...",
        });
        setTimeout(() => {
            toast({
                title: "Terkirim!",
                description: "Notifikasi berhasil dikirim ke semua petugas RT/RW.",
            });
        }, 1500);
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Pusat Administrasi
        </h1>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem, pengguna, dan fitur-fitur lanjutan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="bg-secondary p-3 rounded-full w-max mb-4">
              <UserCog className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Manajemen Pengguna</CardTitle>
            <CardDescription>
              Atur peran dan kelola hak akses pengguna sistem secara terpusat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/dashboard/users">Kelola Pengguna</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="bg-secondary p-3 rounded-full w-max mb-4">
              <DatabaseBackup className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Cadangkan & Pulihkan Data</CardTitle>
            <CardDescription>
              Buat cadangan data UMKM dan pengguna secara manual atau otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackup}>Mulai Mencadangkan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="bg-secondary p-3 rounded-full w-max mb-4">
              <BellRing className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Kirim Notifikasi</CardTitle>
            <CardDescription>
              Kirim pengumuman penting ke semua Petugas RT/RW.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleNotify}>Buat Notifikasi</Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
                <CardTitle>Catatan Pengembangan</CardTitle>
                <CardDescription>
                    Halaman ini adalah contoh bagaimana seorang admin bisa memiliki panel kontrol khusus. Fitur-fitur di atas saat ini adalah simulasi dan dapat diimplementasikan dengan logika bisnis nyata di masa mendatang, seperti menghubungkan ke database, mengatur autentikasi, dan membangun layanan notifikasi.
                </CardDescription>
            </CardHeader>
          </Card>
      </div>
    </div>
  );
}
