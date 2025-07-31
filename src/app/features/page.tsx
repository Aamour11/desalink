
import Link from "next/link";
import {
  Users,
  LayoutGrid,
  BarChart3,
  FileText,
  PlusCircle,
  Upload,
  ArrowLeft,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Manajemen Pengguna",
      description:
        "Sistem berbasis peran untuk Admin Desa dan Petugas RT/RW. Admin dapat mengelola semua data, sementara petugas hanya dapat mengelola data di wilayahnya, memastikan keamanan dan relevansi data.",
    },
    {
      icon: <PlusCircle className="h-8 w-8 text-primary" />,
      title: "Pendataan UMKM Komprehensif",
      description:
        "Formulir detail untuk mencatat semua informasi penting UMKM, mulai dari nama usaha, pemilik, NIB, jenis usaha, kontak, hingga status operasional dan jumlah karyawan.",
    },
    {
      icon: <LayoutGrid className="h-8 w-8 text-primary" />,
      title: "Direktori UMKM dengan Filter",
      description:
        "Fitur pencarian dan filter yang kuat memungkinkan pengguna untuk dengan cepat menemukan data UMKM berdasarkan nama, pemilik, jenis usaha, atau status.",
    },
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Profil Usaha dengan Gambar",
      description:
        "Setiap UMKM memiliki halaman profil sendiri dan dapat mengunggah gambar produk atau tempat usaha untuk memberikan gambaran yang lebih baik kepada calon pelanggan atau mitra.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Dashboard & Statistik Visual",
      description:
        "Dasbor utama menyajikan data dalam bentuk grafik yang mudah dibaca, seperti distribusi UMKM per jenis usaha, per wilayah RT/RW, dan tren pertumbuhan dari tahun ke tahun.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Ekspor Laporan PDF & CSV",
      description:
        "Admin dapat mengunduh seluruh data UMKM dalam format PDF yang rapi atau CSV untuk diolah lebih lanjut di aplikasi lain seperti Microsoft Excel, mempermudah pelaporan dan analisis.",
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
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Fitur Unggulan
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Jelajahi kemampuan platform DesaLink UMKM yang dirancang untuk
              menyederhanakan manajemen data dan mendorong pertumbuhan ekonomi
              lokal.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col bg-background/50 h-full"
              >
                <CardHeader>
                  <div className="bg-secondary p-3 rounded-full w-max mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
             <Card className="flex flex-col bg-secondary/80 h-full md:col-span-2 lg:col-span-3">
              <CardHeader>
                <div className="bg-background/80 p-3 rounded-full w-max mb-4">
                  <Cpu className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">
                  Bagaimana Data Diolah?
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  Ingin tahu lebih dalam tentang bagaimana data mentah diubah
                  menjadi statistik dan grafik yang informatif di dasbor? Kami
                  telah menyiapkan halaman khusus yang menjelaskan alur kerja
                  dan algoritma di balik layar.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="bg-background">
                  <Link href="/algorithms">Pelajari Algoritma</Link>
                </Button>
              </CardFooter>
            </Card>
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
