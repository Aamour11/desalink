
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, BellRing, UserCog, Ban, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { User, UMKM } from "@/lib/types";
import { getUsersData, getUmkmData, sendAnnouncement } from "@/server/actions";
import Loading from "@/app/loading";
import Papa from "papaparse";

export default function AdminCenterPage() {
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState<Omit<User, 'password_hash'>[]>([]);
    const [allUmkm, setAllUmkm] = useState<UMKM[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    
    useEffect(() => {
      async function fetchData() {
        try {
            const usersData = await getUsersData();
            const umkmData = await getUmkmData();
            setAllUsers(usersData);
            setAllUmkm(umkmData);
        } catch (error) {
          toast({ variant: "destructive", title: "Gagal memuat data", description: "Tidak dapat mengambil data pengguna atau UMKM." });
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [toast]);

    const handleBackup = () => {
        toast({
            title: "Proses Dimulai",
            description: "Mempersiapkan data untuk diunduh...",
        });

        try {
            // Backup Users
            const usersCsv = Papa.unparse(allUsers);
            downloadCsv(usersCsv, "users-backup.csv");

            // Backup UMKM
            const umkmCsv = Papa.unparse(allUmkm);
            downloadCsv(umkmCsv, "umkm-backup.csv");

            toast({
                title: "Sukses!",
                description: "Cadangan data pengguna dan UMKM telah diunduh.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Gagal!",
                description: "Terjadi kesalahan saat membuat file cadangan.",
            });
        }
    }

    const downloadCsv = (csvData: string, filename: string) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleSendNotification = async () => {
        if (notificationMessage.trim().length === 0) {
            toast({ variant: "destructive", title: "Gagal", description: "Pesan tidak boleh kosong." });
            return;
        }
        setIsSending(true);
        try {
            await sendAnnouncement(notificationMessage);
            toast({ title: "Terkirim!", description: "Notifikasi berhasil dikirim ke semua pengguna." });
            setNotificationMessage("");
            setIsNotifyDialogOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
            toast({ variant: "destructive", title: "Gagal Mengirim", description: errorMessage });
        } finally {
            setIsSending(false);
        }
    }

    if (loading) {
      return <Loading />;
    }

  return (
    <>
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
            <CardTitle>Cadangkan Data</CardTitle>
            <CardDescription>
              Unduh salinan data Pengguna dan UMKM dalam format CSV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackup} disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Unduh Cadangan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="bg-secondary p-3 rounded-full w-max mb-4">
              <BellRing className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Kirim Notifikasi</CardTitle>
            <CardDescription>
              Kirim pengumuman atau catatan penting ke semua pengguna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsNotifyDialogOpen(true)}>Buat Notifikasi</Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
                <CardTitle>Catatan Pengembangan</CardTitle>
                <CardDescription>
                    Halaman ini adalah contoh bagaimana seorang admin bisa memiliki panel kontrol khusus. Fitur-fitur di atas seperti Notifikasi masih berupa simulasi dan dapat diimplementasikan dengan logika bisnis nyata di masa mendatang.
                </CardDescription>
            </CardHeader>
          </Card>
      </div>
    </div>
    <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Notifikasi atau Catatan</DialogTitle>
                <DialogDescription>
                    Tulis pesan yang akan ditampilkan di dasbor semua pengguna.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Textarea 
                    placeholder="Ketik pesan Anda di sini..." 
                    rows={5}
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                </DialogClose>
                <Button onClick={handleSendNotification} disabled={isSending}>
                    {isSending ? "Mengirim..." : "Kirim Notifikasi"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
