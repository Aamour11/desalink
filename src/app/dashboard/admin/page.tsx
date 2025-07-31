import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, BellRing, UserCog } from "lucide-react";

export default function AdminCenterPage() {
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
            <CardTitle>Manajemen Pengguna Lanjutan</CardTitle>
            <CardDescription>
              Atur peran, reset kata sandi, dan kelola hak akses pengguna secara terpusat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Kelola Pengguna</Button>
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
            <Button disabled>Mulai Mencadangkan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="bg-secondary p-3 rounded-full w-max mb-4">
              <BellRing className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Kirim Notifikasi</CardTitle>
            <CardDescription>
              Kirim pengumuman atau notifikasi penting ke semua Petugas RT/RW.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Buat Notifikasi</Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
                <CardTitle>Catatan Pengembangan</CardTitle>
                <CardDescription>
                    Halaman ini adalah contoh bagaimana seorang admin bisa memiliki panel kontrol khusus. Fitur-fitur di atas saat ini dinonaktifkan dan dapat diimplementasikan di masa mendatang, seperti menghubungkan ke database, mengatur autentikasi, dan membangun logika bisnis untuk setiap fitur.
                </CardDescription>
            </CardHeader>
          </Card>
      </div>
    </div>
  );
}
