"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  LayoutGrid,
  BarChart3,
  FileText,
  PlusCircle,
  Upload,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

export function LandingPage() {
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
                <Link href="/dashboard">Mulai <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-20 text-center sm:py-32">
           <div className="mb-4 inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            Sistem Informasi UMKM Terpadu
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Pemberdayaan Ekonomi Desa
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Kelola, analisis, dan kembangkan potensi UMKM di tingkat desa dan RT/RW dengan platform digital yang modern dan mudah digunakan.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">Masuk ke Dashboard</Link>
            </Button>
             <Button size="lg" variant="outline" asChild>
              <Link href="/features">Pelajari Fitur</Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted/40 py-20 sm:py-32">
          <div className="container">
            <div className="relative rounded-xl shadow-2xl shadow-primary/10 border">
              <Image
                src="https://placehold.co/1200x675/png"
                alt="Dashboard Preview"
                width={1200}
                height={675}
                className="rounded-xl"
                data-ai-hint="dashboard community"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/50 via-background/20 to-transparent"></div>
            </div>
          </div>
        </section>

        <section className="container py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
             <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Platform Lengkap untuk Desa Digital
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Semua yang Anda butuhkan untuk digitalisasi dan pengelolaan data UMKM yang efisien.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl bg-background/50">
                <CardHeader>
                  <div className="bg-secondary p-3 rounded-full w-max mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-muted/40 border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
           <Link href="/" className="flex items-center gap-2 w-max mx-auto mb-4">
            <LogoIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold">
              DesaLink UMKM
            </span>
          </Link>
          <p>© {new Date().getFullYear()} DesaLink UMKM. Solusi Digital untuk Desa Maju.</p>
        </div>
      </footer>
    </div>
  );
}
