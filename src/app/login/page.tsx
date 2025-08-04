
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
import { loginSchema } from "@/lib/schema";
import { signIn } from "@/server/actions";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn(values);
      toast({
        title: "Login Berhasil",
        description: "Mengalihkan ke dasbor...",
      });
      // This is the most reliable way to navigate and refresh the session state across the app.
      router.push('/dashboard');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast({
        variant: "destructive",
        title: "Login Gagal",
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
            <CardTitle className="font-headline text-2xl">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription>
              Masuk untuk melanjutkan ke dasbor Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="pengguna@desa.com"
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
                <Button
                  type="submit"
                  className="w-full !mt-8"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Memproses..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground flex justify-center gap-4">
          <p>
            Daftar sebagai{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Admin
            </Link>
          </p>
          <p>
            Daftar sebagai{" "}
            <Link
              href="/signup-petugas"
              className="font-semibold text-primary hover:underline"
            >
              Petugas
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
