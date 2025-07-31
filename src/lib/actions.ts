"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { umkmSchema } from "@/lib/schema";

// This is a mock implementation. In a real app, you would interact with a database.

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid.",
    };
  }

  console.log("Creating UMKM:", validatedFields.data);
  // In a real app: await db.umkm.create({ data: validatedFields.data });

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
  
  console.log(`Updating UMKM ${id}:`, validatedFields.data);
  // In a real app: await db.umkm.update({ where: { id }, data: validatedFields.data });
  
  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
  redirect("/dashboard/umkm");
}

export async function deleteUmkm(id: string) {
  try {
    console.log(`Deleting UMKM ${id}`);
    // In a real app: await db.umkm.delete({ where: { id } });
    revalidatePath("/dashboard/umkm");
    return { message: "UMKM berhasil dihapus." };
  } catch (e) {
    return { message: "Gagal menghapus UMKM." };
  }
}
