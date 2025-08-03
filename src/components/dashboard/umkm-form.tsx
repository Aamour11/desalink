
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import React from "react";

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
import { createUmkm, updateUmkm, getCurrentUser } from "@/server/actions";
import type { UMKM, User } from "@/lib/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UmkmFormValues = z.infer<typeof umkmSchema>;

export function UmkmForm({ defaultValues }: { defaultValues?: UMKM }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  const form = useForm<UmkmFormValues>({
    resolver: zodResolver(umkmSchema),
    defaultValues: {
      businessName: defaultValues?.businessName || "",
      ownerName: defaultValues?.ownerName || "",
      nib: defaultValues?.nib || "",
      businessType: defaultValues?.businessType,
      address: defaultValues?.address || "",
      rtRw: defaultValues?.rtRw || currentUser?.rtRw || "",
      contact: defaultValues?.contact || "",
      status: defaultValues?.status || "aktif",
      legality: defaultValues?.legality || "Sedang Diproses",
      startDate: defaultValues?.startDate || "",
      employeeCount: defaultValues?.employeeCount || undefined,
      description: defaultValues?.description || "",
      imageUrl: defaultValues?.imageUrl || "",
    },
  });

  React.useEffect(() => {
      if (currentUser?.role === 'Petugas RT/RW' && !defaultValues) {
          form.setValue('rtRw', currentUser.rtRw);
      }
  }, [currentUser, defaultValues, form]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        toast({
            variant: 'destructive',
            title: "Upload Gagal",
            description: "Ukuran file tidak boleh melebihi 10MB.",
        });
        return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      toast({ title: "Sukses", description: "Gambar berhasil diunggah." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah.";
      toast({ variant: 'destructive', title: "Upload Gagal", description: errorMessage });
    } finally {
      setIsUploading(false);
      // Reset the file input value
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const onSubmit = async (data: UmkmFormValues) => {
    try {
      if (defaultValues) {
        // Pass the old image URL to the update action
        await updateUmkm(defaultValues.id, data, defaultValues.imageUrl);
        toast({ title: "Sukses", description: "Data UMKM berhasil diperbarui." });
      } else {
        await createUmkm(data);
        toast({ title: "Sukses", description: "UMKM baru berhasil ditambahkan." });
      }
      router.push("/dashboard/umkm");
      router.refresh(); // Refresh the page to show new data
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data.";
       toast({ variant: 'destructive', title: "Gagal", description: errorMessage });
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
                          <div
                            className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/40 relative"
                          >
                            {isUploading ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-lg">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                              </div>
                            ) : null}

                            {field.value ? (
                              <Image src={field.value} alt="Preview" width={300} height={168} className="h-full w-full object-cover rounded-md" data-ai-hint="business product" />
                            ) : (
                              <div className="text-center text-muted-foreground p-4">
                                <Upload className="mx-auto h-8 w-8" />
                                <p className="mt-2 text-sm">Klik untuk mengunggah gambar</p>
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? "Mengunggah..." : "Pilih Gambar"}
                          </Button>
                          <Input
                            ref={fileInputRef}
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          <FormDescription className="mt-2 text-center">
                            Ukuran file maksimal 10MB.
                          </FormDescription>
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
                    <Input 
                        placeholder="Contoh: 001/001" 
                        {...field} 
                        readOnly={currentUser?.role === 'Petugas RT/RW'}
                        />
                  </FormControl>
                   {currentUser?.role === 'Petugas RT/RW' && <FormDescription>Wilayah RT/RW diatur sesuai dengan akun Anda.</FormDescription>}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status Operasional</FormLabel>
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
                  name="legality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Legalitas</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status legalitas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lengkap">Lengkap</SelectItem>
                          <SelectItem value="Tidak Lengkap">Tidak Lengkap</SelectItem>
                          <SelectItem value="Sedang Diproses">Sedang Diproses</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
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
          <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
