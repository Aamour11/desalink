'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { umkmSchema } from "@/lib/schema";
import { mockUmkm } from "./data";

// This is a mock implementation. In a real app, you would interact with a database.

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid.",
    };
  }

  // Simulate adding to the database
  const newUmkm = {
    id: `umkm-${Date.now()}`, // Generate a pseudo-unique ID
    ...validatedFields.data,
    // Ensure all required fields have default values if not in form
    imageUrl: validatedFields.data.imageUrl || 'https://placehold.co/600x400.png',
    employeeCount: validatedFields.data.employeeCount || 0,
    startDate: validatedFields.data.startDate || new Date().toISOString().split('T')[0],
    description: validatedFields.data.description || '',
    nib: validatedFields.data.nib || '',
  };
  mockUmkm.push(newUmkm);

  console.log("Creating UMKM:", newUmkm);
  
  revalidatePath("/dashboard/umkm");
  redirect("/dashboard/umkm");
}

export async function updateUmkm(
  id: string,
  values: z.infer<typeof umkmSchema>
) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid.",
    };
  }
  
  // Simulate updating the database
  const index = mockUmkm.findIndex(u => u.id === id);
  if (index !== -1) {
    mockUmkm[index] = { ...mockUmkm[index], ...validatedFields.data };
  }
  
  console.log(`Updating UMKM ${id}:`, validatedFields.data);

  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
  redirect("/dashboard/umkm");
}

export async function deleteUmkm(id: string) {
  try {
    // Simulate deleting from the database
    const index = mockUmkm.findIndex(u => u.id === id);
    if (index > -1) {
      mockUmkm.splice(index, 1);
    }
    console.log(`Deleting UMKM ${id}`);
    revalidatePath("/dashboard/umkm");
    return { message: "UMKM berhasil dihapus." };
  } catch (e) {
    return { message: "Gagal menghapus UMKM." };
  }
}
