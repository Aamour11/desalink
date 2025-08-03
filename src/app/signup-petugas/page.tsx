
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { signupPetugasSchema } from "@/lib/schema";
import { createPetugasUser } from "@/server/actions";


export default function SignupPetugasPage() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof signupPetugasSchema>>({
        resolver: zodResolver(signupPetugasSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rtRw: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof signupPetugasSchema>) => {
        try {
            await createPetugasUser(values);
            toast({
                title: "Pendaftaran Berhasil",
                description: "Akun petugas Anda telah dibuat. Silakan login.",
            });
            router.push("/login");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
            toast({
                variant: "destructive",
                title: "Pendaftaran Gagal",
                description: errorMessage,
            });
        }
    };

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
            <CardTitle className="font-headline text-2xl">Buat Akun Petugas</CardTitle>
            <CardDescription>
              Halaman ini khusus untuk mendaftarkan akun Petugas RT/RW.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="petugas@desa.com"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rtRw"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Wilayah (RT/RW)</FormLabel>
                        <FormControl>
                            <Input placeholder="Contoh: 001/001" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full !mt-8" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Mendaftar..." : "Daftar Sebagai Petugas"}
                </Button>
                </form>
            </Form>
          </CardContent>
        </Card>
         <p className="text-center text-sm text-muted-foreground mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

