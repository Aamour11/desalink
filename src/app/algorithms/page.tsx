
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Filter,
  FileDown,
  BarChart3,
  ListOrdered,
  Cpu,
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
  const flowchartSteps = [
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      title: "1. Pengumpulan & Penyimpanan Data",
      description:
        "Petugas RT/RW melakukan input data UMKM melalui formulir digital. Setiap data yang masuk, termasuk nama usaha, pemilik, jenis, NIB, alamat, foto, dan status, disimpan secara terstruktur dalam database MySQL. Ini memastikan data mentah tersimpan dengan aman dan rapi.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-primary" />,
      title: "2. Pemrosesan di Sisi Server (Backend)",
      description:
        "Ketika pengguna mengakses dasbor atau halaman data, aplikasi di sisi server (menggunakan Next.js & TypeScript) akan mengambil data mentah dari database. Fungsi-fungsi khusus kemudian mengolah data ini sesuai dengan peran pengguna (Admin atau Petugas).",
    },
    {
      icon: <Filter className="h-5 w-5 text-primary" />,
      title: "3. Agregasi & Perhitungan Statistik",
      description:
        "Server melakukan perhitungan statistik kunci: menjumlahkan total UMKM, menghitung UMKM yang aktif, dan yang memiliki NIB. Data juga dikelompokkan (diagregasi) berdasarkan jenis usaha, wilayah RT/RW, dan tahun berdiri untuk menghasilkan ringkasan data.",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      title: "4. Visualisasi Data di Dasbor (Frontend)",
      description:
        "Hasil agregasi data dikirim ke antarmuka pengguna (frontend). Komponen grafik (menggunakan Recharts) kemudian mengubah angka-angka statistik menjadi visualisasi yang mudah dipahami, seperti diagram batang dan diagram lingkaran, di halaman dasbor.",
    },
    {
      icon: <ListOrdered className="h-5 w-5 text-primary" />,
      title: "5. Penyajian Data Tabular dengan Filter",
      description:
        "Di halaman 'Data UMKM', semua data disajikan dalam format tabel yang interaktif. Pengguna dapat melakukan pencarian berdasarkan nama, filter berdasarkan jenis usaha, status, atau wilayah. Semua proses filter ini terjadi secara langsung di antarmuka pengguna untuk respons yang cepat.",
    },
    {
      icon: <FileDown className="h-5 w-5 text-primary" />,
      title: "6. Ekspor Data ke PDF & CSV",
      description:
        "Fitur ekspor mengubah data yang sudah difilter menjadi format PDF yang rapi (menggunakan jspdf-autotable) atau CSV (menggunakan papaparse). Proses ini memungkinkan data digital diubah menjadi laporan fisik atau file yang bisa diolah di aplikasi lain.",
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
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Alur Kerja & Pemrosesan Data
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Memahami bagaimana data mentah UMKM diubah menjadi wawasan
              berharga melalui beberapa tahapan logis di dalam sistem DesaLink
              UMKM.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flowchartSteps.map((step, index) => (
              <Card key={index} className="flex flex-col bg-background/50">
                <CardHeader>
                  <CardTitle className="font-headline text-lg flex items-center gap-3">
                    <div className="flex-shrink-0 bg-secondary p-3 rounded-full w-max">
                        {step.icon}
                    </div>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">
                    {step.description}
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
