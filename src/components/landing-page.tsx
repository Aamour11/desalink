
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";
import {
  Users,
  LayoutGrid,
  BarChart3,
  FileText,
  PlusCircle,
  Upload,
  ArrowRight,
  User,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

function ThreeDCardAnimation() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };
  
   const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
     <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative flex h-96 w-full max-w-4xl items-center justify-center rounded-xl bg-muted/40 p-8"
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} className="absolute">
         <div className="relative w-96 rounded-lg border bg-card p-4 shadow-lg shadow-primary/10">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-headline text-lg">Total UMKM</h3>
                <Store className="text-primary" />
            </div>
            <p className="text-4xl font-bold">1,250</p>
            <p className="text-sm text-muted-foreground">+15% dari bulan lalu</p>
         </div>
      </div>
       <motion.div
        style={{
            transform: "translateZ(40px) translateX(-150px) translateY(-80px) rotateZ(-15deg)",
            transformStyle: "preserve-3d",
        }}
        className="absolute"
      >
        <div className="w-48 p-3 rounded-lg border bg-card shadow-md shadow-primary/10">
            <div className="flex items-center gap-2">
                <LineChart className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Pertumbuhan</h4>
            </div>
            <div className="w-full h-16 bg-primary/20 rounded-md mt-2 animate-pulse"></div>
        </div>
      </motion.div>
       <motion.div
         style={{
            transform: "translateZ(20px) translateX(200px) translateY(60px) rotateZ(10deg)",
            transformStyle: "preserve-3d",
        }}
        className="absolute flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm shadow-primary/10"
      >
        <User className="text-primary" />
        <span className="text-sm font-medium">Data Pengguna</span>
      </motion.div>
    </motion.div>
  );
}


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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
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
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
            >
              Sistem Informasi UMKM Terpadu
            </motion.div>
            <motion.h1
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Pemberdayaan Ekonomi Desa
            </motion.h1>
            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            >
              Kelola, analisis, dan kembangkan potensi UMKM di tingkat desa dan
              RT/RW dengan platform digital yang modern dan mudah digunakan.
            </motion.p>
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Button size="lg" asChild>
                <Link href="/dashboard">Masuk ke Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Pelajari Fitur</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <section className="bg-muted/40 py-20 sm:py-32">
          <div className="container flex justify-center">
            <ThreeDCardAnimation />
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
              </motion.div>
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
