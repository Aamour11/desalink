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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold text-foreground">
              DesaLink UMKM
            </span>
          </Link>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 text-center md:py-24 lg:py-32">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Pemberdayaan UMKM Desa
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Sistem informasi terintegrasi untuk mengelola, menganalisis, dan
            mengembangkan potensi UMKM di tingkat desa dan RT/RW.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/login">Mulai Kelola</Link>
            </Button>
          </div>
        </section>

        <section className="bg-background/80 py-12 md:py-24">
          <div className="container">
            <div className="relative rounded-xl shadow-2xl shadow-primary/10">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="Dashboard Preview"
                width={1200}
                height={600}
                className="rounded-xl"
                data-ai-hint="dashboard community"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Fitur Unggulan
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Dirancang untuk memberikan kemudahan dan wawasan dalam pengelolaan
              data UMKM.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DesaLink UMKM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
