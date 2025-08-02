
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { userFormSchema, editUserFormSchema } from "@/lib/schema";
import { addNewUser, updateUser } from "@/server/actions";
import type { User } from "@/lib/types";

type UserFormValues = z.infer<typeof userFormSchema>;
type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export function UserForm({ defaultValues }: { defaultValues?: User & { password?: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditMode = !!defaultValues?.id;

  const form = useForm<UserFormValues | EditUserFormValues>({
    resolver: zodResolver(isEditMode ? editUserFormSchema : userFormSchema),
    defaultValues: {
        ...defaultValues,
        role: defaultValues?.role || "Petugas RT/RW",
        password: "", // Selalu kosongkan password di form
    } || { role: "Petugas RT/RW" },
  });

  const onSubmit = async (data: UserFormValues | EditUserFormValues) => {
    try {
        if (isEditMode && defaultValues) {
            await updateUser(defaultValues.id, data as EditUserFormValues);
            toast({ title: "Sukses", description: "Data pengguna berhasil diperbarui." });
        } else {
            await addNewUser(data as UserFormValues);
            toast({ title: "Sukses", description: "Pengguna baru berhasil ditambahkan." });
        }
      
      router.push("/dashboard/users");
      router.refresh(); 
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
       toast({ variant: 'destructive', title: "Gagal", description: errorMessage });
    }
  };
  
  const role = form.watch("role");

  return (
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
                    placeholder="pengguna@desa.com"
                    {...field}
                    readOnly={isEditMode}
                />
                </FormControl>
                 {isEditMode && <FormDescription>Email tidak dapat diubah.</FormDescription>}
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Kata Sandi</FormLabel>
                <FormControl>
                    <Input type="password" {...field} placeholder={isEditMode ? "Kosongkan jika tidak ingin diubah" : "Minimal 6 karakter"} />
                </FormControl>
                 <FormDescription>
                    {isEditMode ? "Isi untuk mengubah kata sandi pengguna." : "Kata sandi default untuk pengguna baru."}
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Peran (Role)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih peran pengguna" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Admin Desa">Admin Desa</SelectItem>
                        <SelectItem value="Petugas RT/RW">Petugas RT/RW</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <Input 
                            placeholder="Contoh: 001/001" 
                            {...field} 
                            disabled={role === 'Admin Desa'}
                            value={role === 'Admin Desa' ? '-' : (field.value === '-' ? '' : field.value || '')}
                            onChange={(e) => {
                                if (role !== 'Admin Desa') {
                                    field.onChange(e.target.value);
                                }
                            }}
                        />
                    </FormControl>
                     <FormDescription>
                        Diisi jika peran adalah "Petugas RT/RW".
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end gap-2 pt-4">
           <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
