import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/lib/data";

export default function SettingsPage() {
  const currentUser = mockUsers[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Pengaturan
        </h1>
        <p className="text-muted-foreground">
          Kelola profil, preferensi, dan pengaturan akun Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>
            Informasi ini akan ditampilkan di profil Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" defaultValue={currentUser.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" type="email" defaultValue={currentUser.email} readOnly />
             <p className="text-xs text-muted-foreground">
              Email tidak dapat diubah.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button>Simpan Perubahan</Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Untuk keamanan, pastikan Anda menggunakan kata sandi yang kuat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Kata Sandi Baru</Label>
            <Input id="new-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
         <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button>Ubah Kata Sandi</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferensi</CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan bahasa aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="theme">Tema Tampilan</Label>
             <Select defaultValue="system">
                <SelectTrigger id="theme" className="w-[240px]">
                    <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Terang</SelectItem>
                    <SelectItem value="dark">Gelap</SelectItem>
                    <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
         <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button>Simpan Preferensi</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
