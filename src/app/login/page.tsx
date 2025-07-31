import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
          aria-label="Back to homepage"
        >
          <LogoIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            DesaLink UMKM
          </span>
        </Link>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Selamat Datang Kembali</CardTitle>
            <CardDescription>
              Masuk untuk melanjutkan ke dasbor Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/dashboard" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@desa.com"
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required  className="bg-background"/>
              </div>
              <Button type="submit" className="w-full !mt-8" size="lg">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
         <p className="text-center text-sm text-muted-foreground mt-6">
          Belum punya akun?{' '}
          <Link href="#" className="font-semibold text-primary hover:underline">
            Hubungi Admin
          </Link>
        </p>
      </div>
    </div>
  );
}
