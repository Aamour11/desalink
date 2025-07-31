"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { umkmSchema } from "@/lib/schema";
import { createUmkm, updateUmkm } from "@/server/actions";
import type { UMKM } from "@/lib/types";

type UmkmFormValues = z.infer<typeof umkmSchema>;

export function UmkmForm({ defaultValues }: { defaultValues?: UMKM }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<UmkmFormValues>({
    resolver: zodResolver(umkmSchema),
    defaultValues: {
      ...defaultValues,
      employeeCount: defaultValues?.employeeCount || undefined,
    } || { status: "aktif" },
  });

  const onSubmit = async (data: UmkmFormValues) => {
    try {
      if (defaultValues) {
        await updateUmkm(defaultValues.id, data);
        toast({ title: "Sukses", description: "Data UMKM berhasil diperbarui." });
      } else {
        await createUmkm(data);
        toast({ title: "Sukses", description: "UMKM baru berhasil ditambahkan." });
      }
      router.push("/dashboard/umkm");
    } catch (error) {
       toast({ variant: 'destructive', title: "Gagal", description: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Usaha/UMKM</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Warung Makan Bu Siti" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemilik</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Siti Rahayu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nib"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Induk Berusaha (NIB)</FormLabel>
                  <FormControl>
                    <Input placeholder="13 digit NIB (jika ada)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Usaha</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis usaha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kuliner">Kuliner</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                      <SelectItem value="Jasa">Jasa</SelectItem>
                      <SelectItem value="Pertanian">Pertanian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Kontak (Telepon/WA)</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 081234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Foto Produk/Usaha</FormLabel>
                    <FormControl>
                      <Card>
                        <CardContent className="p-4">
                           <div className="grid w-full max-w-sm items-center gap-1.5">
                            <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/40">
                              {field.value ? (
                                <Image src={field.value} alt="Preview" width={200} height={112} className="h-full w-full object-cover rounded-md" data-ai-hint="business product" />
                              ) : (
                                <div className="text-center text-muted-foreground">
                                  <Upload className="mx-auto h-8 w-8" />
                                  <p className="mt-2 text-sm">Upload gambar</p>
                                </div>
                              )}
                            </div>
                            <Input id="picture" type="file" className="mt-2" />
                            <FormDescription>Gambar utama untuk usaha Anda. (Fitur upload sedang dalam pengembangan)</FormDescription>
                          </div>
                        </CardContent>
                      </Card>
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
                  <FormLabel>RT/RW</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 001/001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jl. Merdeka No. 10, Dusun Bahagia"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-6">
           <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Singkat Usaha</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan tentang usaha Anda..."
                      className="resize-vertical"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status UMKM</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="aktif" />
                            </FormControl>
                            <FormLabel className="font-normal">Aktif</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tidak aktif" />
                            </FormControl>
                            <FormLabel className="font-normal">Tidak Aktif</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Berdiri Usaha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                       <FormDescription>Opsional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Karyawan</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                       <FormDescription>Opsional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
