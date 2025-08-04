import Link from "next/link";
import { ArrowLeft, CheckCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

export default function ConclusionPage() {
  const conclusions = [
    {
      text: "Telah berhasil dikembangkan sebuah sistem informasi DesaLink UMKM berbasis web yang efektif untuk membantu pemerintah desa dalam mengelola data UMKM. Sistem ini menjadi solusi atas permasalahan data yang sebelumnya manual, tersebar, dan sulit dianalisis, terutama di tingkat RT/RW.",
    },
    {
      text: "Implementasi arsitektur data terpusat dengan basis peran (Admin Desa dan Petugas RT/RW) terbukti mampu menyajikan data yang relevan dan aman. Sistem berhasil mengolah data mentah menjadi ringkasan statistik dan visualisasi data yang informatif, seperti grafik jumlah UMKM per wilayah dan jenis usaha.",
    },
    {
      text: "Aplikasi yang dibangun berfungsi sebagai dasbor analitik dan alat manajemen komprehensif yang menjawab kebutuhan akan adanya sistem digital untuk monitoring dan perencanaan ekonomi lokal. Pemerintah desa kini dapat dengan mudah mengakses, memfilter, dan mengekspor data untuk pengambilan keputusan yang berbasis data.",
    },
    {
      text: "Dengan demikian, penelitian ini telah berhasil mencapai tujuannya, yaitu merancang dan membangun sistem informasi terpadu, menerapkan alur pemrosesan data untuk menghasilkan statistik yang berguna, dan pada akhirnya mempermudah pemerintah desa dalam memantau serta mengembangkan potensi UMKM secara lebih terstruktur.",
    },
  ];

  const suggestions = [
    {
      text: "Integrasi dengan Sistem Notifikasi Real-time: Mengembangkan fitur notifikasi otomatis (misalnya, melalui WhatsApp atau email) kepada pemilik UMKM ketika masa berlaku izin usaha mereka akan habis, atau ketika ada pengumuman penting dari desa.",
    },
    {
      text: "Pengembangan Modul Pelaporan Keuangan Sederhana: Menambahkan fitur bagi pemilik UMKM untuk mencatat transaksi dasar (pemasukan dan pengeluaran). Data ini dapat diolah menjadi laporan keuangan sederhana yang membantu mereka memantau kesehatan bisnis dan dapat menjadi nilai tambah bagi pemerintah desa dalam menilai kinerja UMKM.",
    },
    {
      text: "Penerapan Dashboard Analitik dengan AI (Genkit): Menggunakan Genkit untuk menganalisis tren data historis dan memberikan prediksi atau wawasan (insight) otomatis. Contohnya, 'Jenis usaha kuliner menunjukkan pertumbuhan paling pesat di RW 02 dalam 6 bulan terakhir.'",
    },
    {
      text: "Ekspansi ke Platform Mobile: Mengembangkan aplikasi versi mobile (Android/iOS) untuk Petugas RT/RW dan pemilik UMKM. Ini akan mempermudah proses pendataan langsung di lapangan dan memungkinkan pemilik UMKM untuk memperbarui data mereka sendiri secara mandiri.",
    },
    {
      text: "Fitur Peta Geografis (GIS): Mengintegrasikan data lokasi UMKM dengan peta interaktif. Fitur ini dapat memvisualisasikan sebaran UMKM secara geografis, membantu dalam analisis potensi wilayah, dan dapat dipublikasikan ke masyarakat umum sebagai direktori UMKM desa.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              DesaLink UMKM
            </span>
          </Link>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                BAB 5: PENUTUP
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Ringkasan hasil pengembangan dan rekomendasi untuk masa depan.
                </p>
            </div>
            
            <Card className="mt-16">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  5.1 Kesimpulan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {conclusions.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  5.2 Saran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-muted-foreground">Meskipun sistem yang dikembangkan telah memenuhi tujuan awal, terdapat beberapa aspek yang dapat ditingkatkan pada penelitian selanjutnya untuk menghasilkan sistem yang lebih canggih dan bermanfaat. Berikut adalah beberapa saran untuk pengembangan di masa depan:</p>
                {suggestions.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
