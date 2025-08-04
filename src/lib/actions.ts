'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { umkmSchema } from "@/lib/schema";
import { mockUmkm, mockUsers } from "@/lib/data";
import type { UMKM } from "./types";
import { getCurrentUser } from "@/server/actions";


// This file now uses mock data to align with the rest of the application,
// ensuring no actual database connection is attempted.

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("Anda harus login untuk membuat data.");
    }
    
    if (currentUser.role !== 'Petugas RT/RW') {
        throw new Error("Hanya Petugas RT/RW yang dapat membuat data UMKM.");
    }

    const validatedFields = umkmSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }
    
    const newUmkm: UMKM = {
        id: `umkm-${Date.now()}`,
        ...validatedFields.data,
        employeeCount: validatedFields.data.employeeCount || 0,
        imageUrl: validatedFields.data.imageUrl || 'https://placehold.co/600x400.png',
        createdAt: new Date().toISOString(),
    };

    mockUmkm.unshift(newUmkm);
    revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(
  id: string,
  values: z.infer<typeof umkmSchema>
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("Anda harus login untuk memperbarui data.");
    }

    const umkmIndex = mockUmkm.findIndex((u) => u.id === id);

    if (umkmIndex === -1) {
        throw new Error("UMKM tidak ditemukan.");
    }
    
    const umkmToUpdate = mockUmkm[umkmIndex];

    if (currentUser.role === 'Petugas RT/RW' && currentUser.rtRw !== umkmToUpdate.rtRw) {
        throw new Error("Anda tidak memiliki izin untuk mengedit data UMKM ini.");
    }
     if (currentUser.role === 'Admin Desa') {
       throw new Error("Admin tidak dapat mengedit data UMKM.");
    }


    const validatedFields = umkmSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    mockUmkm[umkmIndex] = {
        ...mockUmkm[umkmIndex],
        ...validatedFields.data,
    };

    revalidatePath(`/dashboard/umkm`);
    revalidatePath(`/dashboard/umkm/${id}/edit`);
}

export async function deleteUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("Anda harus login untuk menghapus data.");
    }

    const umkmIndex = mockUmkm.findIndex((u) => u.id === id);

    if (umkmIndex === -1) {
        throw new Error("UMKM tidak ditemukan.");
    }
    const umkmToDelete = mockUmkm[umkmIndex];

    if (currentUser.role === 'Petugas RT/RW' && currentUser.rtRw !== umkmToDelete.rtRw) {
        throw new Error("Anda tidak memiliki izin untuk menghapus data UMKM ini.");
    }
    if (currentUser.role === 'Admin Desa') {
       throw new Error("Admin tidak dapat menghapus data UMKM.");
    }

    mockUmkm.splice(umkmIndex, 1);
    revalidatePath("/dashboard/umkm");
}
