
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Label } from "@/components/ui/label";
import { ThemeSwitcher } from "@/components/dashboard/theme-switcher";
import { updateProfile, updatePassword, getCurrentUser } from "@/server/actions";
import { updateProfileSchema, updatePasswordSchema } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password_hash'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          profileForm.setValue('name', user.name);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [profileForm, router]);


  const onProfileSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser.id, values);
      toast({ title: "Sukses", description: "Profil Anda berhasil diperbarui." });
       router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast({ variant: "destructive", title: "Gagal", description: errorMessage });
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
      if (!currentUser) return;
      try {
        await updatePassword(currentUser.id, values);
        toast({ title: "Sukses", description: "Kata sandi Anda berhasil diubah." });
        passwordForm.reset();
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
        toast({ variant: "destructive", title: "Gagal", description: errorMessage });
      }
  };
  
  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Pengaturan
        </h1>
        <p className="text-muted-foreground">
          Kelola profil, preferensi, dan pengaturan akun Anda.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile and Password Cards */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardHeader>
                  <CardTitle>Profil Pengguna</CardTitle>
                  <CardDescription>
                    Informasi ini akan ditampilkan di profil Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input id="email" type="email" defaultValue={currentUser.email} readOnly />
                    <p className="text-xs text-muted-foreground">
                      Email tidak dapat diubah.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
             <Form {...passwordForm}>
               <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardHeader>
                  <CardTitle>Ubah Kata Sandi</CardTitle>
                  <CardDescription>
                    Untuk keamanan, pastikan Anda menggunakan kata sandi yang kuat.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Saat Ini</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                     {passwordForm.formState.isSubmitting ? "Mengubah..." : "Ubah Kata Sandi"}
                  </Button>
                </CardFooter>
               </form>
            </Form>
          </Card>
        </div>

        {/* Preferences Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi</CardTitle>
              <CardDescription>
                Sesuaikan tampilan dan bahasa aplikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema Tampilan</Label>
                <ThemeSwitcher />
                <p className="text-xs text-muted-foreground">
                  Pilih antara tema terang, gelap, atau bawaan sistem.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
