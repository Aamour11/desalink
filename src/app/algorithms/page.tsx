
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Cpu,
  Database,
  ListOrdered,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";

export default function AlgorithmsPage() {
  const counterPickFactors = [
    {
      title: "Agresivitas",
      description: "Menentukan gaya bermain (defensif, seimbang, agresif). Karakter agresif dapat diatasi oleh karakter dengan kemampuan bertahan dan serangan balik (punishment) yang kuat."
    },
    {
      title: "Defensiveness",
      description: "Merujuk pada kekuatan bertahan karakter. Karakter dengan pertahanan rendah rentan terhadap tekanan, sementara yang bertahan tinggi bisa menjadi counter bagi lawan dengan serangan cepat."
    },
    {
      title: "Gaya Bertarung (Grappling vs. Striker)",
      description: "Karakter tipe Grappler unggul dalam jarak dekat, seringkali menjadi counter efektif bagi tipe Striker yang mengandalkan pukulan dari jarak menengah."
    },
    {
      title: "Range Control",
      description: "Kemampuan mengontrol jarak pertarungan. Karakter dengan jangkauan serangan jauh secara alami unggul melawan karakter yang harus mendekat untuk menyerang."
    },
    {
      title: "Skill Level & Combo Complexity",
      description: "Tingkat kesulitan menguasai karakter. Karakter dengan kombo sederhana namun efektif bisa menjadi pilihan counter yang baik melawan karakter yang kompleks."
    },
    {
      title: "Mobility",
      description: "Tingkat pergerakan dan kelincahan. Karakter cepat tipe Rushdown dirancang untuk menekan lawan dan menjadi counter bagi karakter yang lambat."
    }
  ];
  
  const flowchartSteps = [
    {
      title: "1. User Input",
      description: "Pengguna mengisi form preferensi gaya bermain (agresivitas, defensiveness, grappling, zoning, dll.) dan bisa memasukkan karakter lawan untuk counter-pick."
    },
    {
      title: "2. Ambil Semua Karakter",
      description: "Sistem mengambil seluruh data karakter dari database, di mana setiap karakter memiliki nilai atribut yang sesuai dengan parameter input pengguna."
    },
    {
      title: "3. Hitung Selisih Atribut",
      description: "Sistem menghitung selisih antara preferensi pengguna dan atribut setiap karakter dengan rumus: Kompatibilitas = 10 – |nilai user – nilai karakter|."
    },
    {
      title: "4. Skor Kecocokan (CBF Score)",
      description: "Skor total dari perhitungan atribut dinormalisasi menjadi nilai persentase (0–100%) untuk menggambarkan tingkat kecocokan."
    },
    {
      title: "5. Urutkan Skor",
      description: "Semua karakter diurutkan berdasarkan skor akhir dari yang tertinggi ke terendah untuk menemukan yang paling cocok."
    },
    {
      title: "6. Tampilkan Top 5 Rekomendasi",
      description: "Sistem menampilkan lima karakter teratas yang paling cocok, lengkap dengan persentase kecocokan dan alasan mengapa karakter tersebut direkomendasikan."
    }
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
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
                <p className="font-bold text-primary">BAB 2</p>
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                    TINJAUAN PUSTAKA
                </h1>
            </div>

            <article className="mt-12 space-y-12">
                <div>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><BookOpen className="h-6 w-6 text-primary" /> 2.1 Deskripsi Topik Yang Sama</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>Pada penelitian Raja Sakti Arief Daulay yang berjudul “Impelementasi Metode Basic Filtering Untuk Rekomendasi Game Coop Di steam” (Meidi Yulian Kandowangko, 2025), diuraikan bahwa Content-based filtering merupakan salah satu metode dalam sistem rekomendasi yang menggunakan metadata dari suatu item dalam katalog untuk memberikan rekomendasi yang sesuai bagi pengguna. Dalam pendekatannya, sistem akan menganalisis deskripsi dan fitur dari item yang disukai pengguna sebelumnya untuk menemukan konten lain yang mirip. Keunggulan dari metode ini adalah tidak membutuhkan banyak data dari pengguna dan tidak bergantung pada seberapa populer suatu item.[5][6]</p>
                        <p>Pada penelitian Steven Pratama Putra yang berjudul "Model untuk Memprediksi Tingkat Kemenangan Berdasarkan Draft Pick Mobile Legends", penerapan algoritma CBF dapat diperluas untuk sistem rekomendasi counter pick dalam game fighting seperti Tekken. Dalam konteks mobile legend, CBF digunakan untuk menganalisis pola kemenangan dan kekalahan antar hero berdasarkan statistik pertandingan, namun konsep serupa dapat diterapkan pada karakter Tekken dengan mempertimbangkan karakteristik gameplay yang berbeda. Sistem counter pick Tekken menggunakan CBF dapat menganalisis data pertandingan berdasarkan fitur-fitur seperti kecepatan serangan, jangkauan, damage yang di hasilkan, pilihan bertahan, dan gerakan lanjutan setiap karakter. Algoritma akan menghitung jarak kedekatan antara karakter berdasarkan parameter gameplay tersebut, kemudian merekomendasikan karakter penangkal atau counter yang memiliki keunggulan strategis. Misalnya, jika pemain menghadapi karakter dengan serangan jarak dekat yang kuat, CBF dapat merekomendasikan karakter dengan kemampuan menguasai area dan menjaga jarak yang efektif berdasarkan pola kemenangan dari data pertandingan sebelumnya. Implementasi ini menunjukkan fleksibilitas algoritma CBF dalam domain gaming yang berbeda, dimana prinsip klasifikasi berdasarkan kedekatan data dapat diadaptasi untuk berbagai jenis analisis strategis dalam permainan kompetitif.[7]</p>
                    </div>
                </div>

                <div>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><Gamepad2 className="h-6 w-6 text-primary" /> 2.2 Game Tekken</h2>
                     <div className="space-y-4 text-muted-foreground">
                        <p>Tekken adalah sebuah game pertarungan (fighting game) legendaris yang dikembangkan dan dipublikasikan oleh Bandai Namco Entertainment. Pertama kali dirilis pada tahun 1994, Tekken menjadi salah satu pionir dalam genre game pertarungan tiga dimensi (3D fighting), dan hingga saat ini telah menjadi salah satu seri game terpopuler dan paling ikonik di dunia.[8]</p>
                        <h3 className="font-headline text-xl font-semibold text-foreground pt-4">2.2.1 Sejarah Singkat</h3>
                        <p>Game pertama Tekken muncul di arcade (mesin ding-dong) dan segera menjadi populer karena menawarkan pertarungan yang realistis dengan karakter-karakter yang memiliki latar belakang dan gaya bertarung yang unik. Tak lama kemudian, game ini di-porting ke konsol PlayStation, dan menjadi salah satu alasan utama kesuksesan konsol tersebut di era 90-an.berikut adalah data karakter dan data user tekken 1 sampai dengan tekken 8 dari tahun ke tahun, berdasarkan data penjualan game dari situs bandi namco :</p>
                        <p>Gambar di atas menunjukkan bahwa jumlah karakter mengalami peningkatan dari tahun ke tahun, dengan puncaknya pada Tekken 7 yang memiliki 50 karakter. Sementara itu, total penjualan tertinggi juga terjadi pada Tekken 7 dengan angka penjualan mencapai 12 juta kopi. Namun, meskipun Tekken 8 memiliki jumlah karakter yang masih cukup banyak (32 karakter), penjualannya justru menurun drastis hanya mencapai 3 juta kopi</p>
                        <h3 className="font-headline text-xl font-semibold text-foreground pt-4">2.2.2 Konsep Counter Pick</h3>
                        <p>Counter pick adalah strategi memilih karakter yang memiliki keunggulan matchup terhadap karakter lawan. Faktor-faktor yang mempengaruhi counter pick meliputi:</p>
                    </div>
                     <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {counterPickFactors.map((factor, index) => (
                          <Card key={index} className="bg-background/50">
                            <CardHeader>
                              <CardTitle className="font-headline text-lg">{index + 1}. {factor.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-sm">
                                {factor.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                </div>

                 <div>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><Database className="h-6 w-6 text-primary" /> 2.3 Dataset Karakteristik Karakter Tekken 8</h2>
                     <div className="space-y-4 text-muted-foreground">
                        <p>Dataset karakteristik karakter pada game Tekken 8 merupakan kumpulan data yang berisi informasi detail mengenai masing-masing karakter, dengan atribut gameplay seperti kecepatan, kekuatan, jangkauan, dan tingkat kesulitan. Data ini diambil langsung dari website resmi Bandai Namco Entertainment sebagai sumber informasi yang valid dan akurat. Tujuan dari pengumpulan dataset ini adalah untuk membangun sistem rekomendasi berbasis Content-Based Filtering (CBF) yang dapat memberikan saran karakter secara strategis berdasarkan parameter gameplay. Berikut adalah struktur tabel dataset yang digunakan:</p>
                        <p>Untuk mendukung proses perhitungan dan analisis dalam aplikasi rekomendasi karakter game Tekken 8, data karakter diolah dan disimpan dalam bentuk tabel database menggunakan phpMyAdmin. Data ini mencakup 31 karakter yang masing-masing memiliki atribut numerik yang menggambarkan karakteristik gaya bermain, yaitu: Aggressiveness, Defensive, Grappling, Zoning, Difficulty, Combo Length, dan Mobility. Setiap atribut diberi nilai dalam skala 1–10, yang bersumber dari analisis manual berdasarkan informasi resmi dari Bandai Namco. Tabel ini kemudian dimasukkan ke dalam sistem database MySQL untuk mempermudah proses pencarian, pengambilan data, dan penghitungan algoritma Based-content filtering (BCF) dalam menentukan karakter yang cocok digunakan sebagai counter pick terhadap karakter lawan,berikut dataset yang sudah di konversi kedalam tabel di database mysql :</p>
                        <p>Dengan dataset ini, sistem rekomendasi dapat mengkalkulasi jarak kemiripan antar karakter, sehingga mampu menghasilkan saran karakter counter pick secara cerdas dan berbasis data yang objektif.</p>
                    </div>
                </div>
                
                <div>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-3"><Cpu className="h-6 w-6 text-primary" /> 2.4 Algoritma Content-Based Filtering (CBF)</h2>
                     <div className="space-y-4 text-muted-foreground">
                        <p>Content-Based Filtering adalah metode sistem rekomendasi yang memberikan rekomendasi berdasarkan analisis karakteristik atau fitur dari item yang akan direkomendasikan. Dalam konteks sistem rekomendasi karakter Tekken, CBF akan menganalisis profil karakteristik gameplay setiap karakter untuk menemukan karakter yang memiliki atribut counter yang optimal.Berikut adalah gambaran algoritma content based filtering :</p>
                        <h3 className="font-headline text-xl font-semibold text-foreground pt-4">Penjelasan Flowchart:</h3>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {flowchartSteps.map((step, index) => (
                           <Card key={index} className="flex flex-col bg-background/50">
                            <CardHeader>
                              <CardTitle className="font-headline text-lg flex items-center gap-2">
                                <div className="flex-shrink-0 bg-secondary p-2 rounded-full w-max">
                                    <ListOrdered className="h-5 w-5 text-primary" />
                                </div>
                                {step.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-sm">
                                {step.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                </div>
            </article>
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
