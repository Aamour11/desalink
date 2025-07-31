
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Database,
  FunctionSquare,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

export default function AlgorithmsPage() {
  const algorithms = [
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "1. Pengumpulan Data Mentah",
      description:
        "Proses dimulai dengan pengumpulan data dari sumber utama. Dalam versi saat ini, data berasal dari array objek (mock data) yang merepresentasikan setiap UMKM. Setiap objek berisi atribut lengkap seperti jenis usaha, RT/RW, tanggal berdiri, dan jumlah karyawan.",
    },
    {
      icon: <FunctionSquare className="h-8 w-8 text-primary" />,
      title: "2. Algoritma Agregasi Data",
      description:
        "Data mentah kemudian diproses menggunakan algoritma agregasi. Fungsi perulangan seperti 'reduce' digunakan untuk mengelompokkan data. Contohnya, untuk menghitung UMKM per jenis usaha, algoritma akan mengiterasi setiap UMKM dan menjumlahkannya ke dalam kategori yang sesuai (Kuliner, Fashion, dll.), menghasilkan struktur data baru yang siap untuk divisualisasikan.",
    },
    {
      icon: <Calculator className="h-8 w-8 text-primary" />,
      title: "3. Perhitungan Statistik",
      description:
        "Setelah data diagregasi, perhitungan statistik dilakukan. Ini termasuk kalkulasi sederhana seperti 'Total UMKM' dan 'UMKM Aktif', hingga perhitungan yang lebih kompleks seperti 'Rata-rata Jumlah Karyawan', yang dihitung dengan membagi total semua karyawan dengan jumlah total UMKM.",
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: "4. Transformasi untuk Visualisasi",
      description:
        "Hasil agregasi dan statistik kemudian diubah (transformasi) menjadi format yang sesuai untuk komponen grafik (seperti Recharts). Misalnya, data agregasi UMKM per tahun diubah menjadi array objek dengan properti 'name' (untuk tahun) dan 'value' (untuk jumlah), yang dapat langsung dirender menjadi grafik batang.",
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
            <Link href="/features">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Fitur
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Algoritma & Pemrosesan Data
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Memahami bagaimana data UMKM diolah dari data mentah menjadi
              wawasan statistik yang berguna di dasbor.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {algorithms.map((feature, index) => (
              <Card key={index} className="flex flex-col bg-background/50">
                <CardHeader>
                  <div className="bg-secondary p-3 rounded-full w-max mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted/40 border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-2 w-max mx-auto mb-4"
          >
            <LogoIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              DesaLink UMKM
            </span>
          </Link>
          <p>
            © {new Date().getFullYear()} DesaLink UMKM. Solusi Digital untuk
            Desa Maju.
          </p>
        </div>
      </footer>
    </div>
  );
}
