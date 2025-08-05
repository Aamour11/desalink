
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  LayoutGrid,
  BarChart3,
  FileText,
  PlusCircle,
  Upload,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoIcon, CilameLogoIcon } from "@/components/icons";
import { signIn } from "@/server/actions";
import { useToast } from "@/hooks/use-toast";


function AnimatedBarChart() {
  return (
    <div className="flex h-full w-full items-end gap-1.5">
      {[0.4, 0.7, 0.5, 0.9, 0.6].map((height, i) => (
        <div
          key={i}
          style={{ height: `${height * 100}%` }}
          className="w-full rounded-t-sm bg-primary/80"
        />
      ))}
    </div>
  );
}


function ThreeDCardAnimation() {
  return (
     <div
      className="relative flex h-96 w-full max-w-4xl items-center justify-center rounded-xl bg-muted/40 p-8"
    >
      <div className="w-[450px] h-64 rounded-xl border bg-card p-4 shadow-lg shadow-primary/10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <LogoIcon className="h-5 w-5 text-primary" />
                <h3 className="font-headline text-md">Dashboard Overview</h3>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
        </div>
        <div className="mt-4 h-48 w-full rounded-md border border-dashed border-border p-2">
             <AnimatedBarChart />
        </div>
      </div>
    </div>
  );
}


export function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Manajemen Pengguna",
      description:
        "Kelola akun dan hak akses untuk Admin Desa dan Petugas RT/RW dengan aman.",
    },
    {
      icon: <PlusCircle className="h-8 w-8 text-primary" />,
      title: "Pendataan UMKM",
      description:
        "Formulir komprehensif untuk menambah dan memperbarui data UMKM dengan mudah.",
    },
    {
      icon: <LayoutGrid className="h-8 w-8 text-primary" />,
      title: "Direktori UMKM",
      description:
        "Lihat, cari, dan filter daftar UMKM terdaftar sesuai dengan hak akses Anda.",
    },
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Upload Gambar Usaha",
      description:
        "Setiap UMKM dapat mengunggah gambar untuk mempromosikan produk atau usahanya.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Dashboard & Statistik",
      description:
        "Visualisasikan data UMKM dengan ringkasan statistik dan grafik yang informatif.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Laporan Terperinci",
      description:
        "Hasilkan laporan lengkap mengenai daftar dan statistik UMKM untuk dianalisis.",
    },
  ];

  const handleAdminLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn({ email: "admin@desa.com", password: "password" }); // Password is not checked in mock
      toast({
        title: "Login Berhasil",
        description: "Mengalihkan ke dasbor admin...",
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Akun admin default tidak ditemukan.",
      });
      setIsLoggingIn(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Mulai <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-20 text-center sm:py-32">
          <div
            className="space-y-6"
          >
            <div
              className="mb-4 inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
            >
              Sistem Informasi UMKM Terpadu
            </div>
            <h1
              className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Pemberdayaan Ekonomi Desa
            </h1>
            <p
              className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            >
              Kelola, analisis, dan kembangkan potensi UMKM di tingkat desa dan
              RT/RW dengan platform digital yang modern dan mudah digunakan.
            </p>
            <div
              className="mt-8 flex justify-center gap-4"
            >
              <Button size="lg" onClick={handleAdminLogin} disabled={isLoggingIn}>
                {isLoggingIn ? "Memproses..." : "Masuk ke Dashboard"}
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Pelajari Fitur</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-20 sm:py-32">
          <div className="container flex justify-center">
            <Image 
              src="https://placehold.co/1024x576.png" 
              alt="Dashboard preview"
              width={1024}
              height={576}
              className="rounded-xl border shadow-lg"
              data-ai-hint="dashboard interface"
            />
          </div>
        </section>

        <section className="container py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Platform Lengkap untuk Desa Digital
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Semua yang Anda butuhkan untuk digitalisasi dan pengelolaan data
              UMKM yang efisien.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
              >
                <Card className="flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-background/50">
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
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/40 py-20 sm:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Studi Kasus: DesaLink di Cilame
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Bagaimana aplikasi kami membantu digitalisasi dan mendorong
                pertumbuhan ekonomi di Desa Cilame, Ngamprah, Bandung Barat.
              </p>
            </div>
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-12">
               <div className="flex-shrink-0">
                  <div className="p-4 bg-background rounded-full shadow-lg">
                    <CilameLogoIcon className="h-32 w-32 text-primary" />
                  </div>
               </div>
               <div className="max-w-2xl text-center md:text-left">
                  <h3 className="font-headline text-2xl font-semibold text-primary">
                    Transformasi Digital UMKM Desa Cilame
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    Sebelum DesaLink, pendataan UMKM di Desa Cilame dilakukan secara manual, menyebabkan data tidak akurat dan sulit diakses. Dengan implementasi platform kami, Petugas RT/RW kini dapat mendata UMKM secara real-time, lengkap dengan informasi NIB dan foto produk. Hasilnya, pemerintah desa kini memiliki dasbor analitik yang akurat untuk membuat kebijakan yang mendukung pertumbuhan ekonomi lokal, dan para pelaku UMKM mendapatkan visibilitas yang lebih baik.
                  </p>
               </div>
            </div>
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
