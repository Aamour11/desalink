'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { umkmSchema } from "@/lib/schema";
import pool from './db';
import type { UMKM } from "./types";

// This is a mock implementation. In a real app, you would interact with a database.

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }
  
  const { businessName, ownerName, nib, businessType, address, rtRw, contact, status, startDate, employeeCount, description, imageUrl } = validatedFields.data;

  try {
    const connection = await pool.getConnection();
    const query = 'INSERT INTO umkm (businessName, ownerName, nib, businessType, address, rtRw, contact, status, startDate, employeeCount, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await connection.execute(query, [
        businessName,
        ownerName,
        nib || null,
        businessType,
        address,
        rtRw,
        contact,
        status,
        startDate || new Date().toISOString().split('T')[0],
        employeeCount || 0,
        description || null,
        imageUrl || 'https://placehold.co/600x400.png'
    ]);
    connection.release();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal membuat data UMKM.');
  }


  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(
  id: string,
  values: z.infer<typeof umkmSchema>
) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }
  
  const { businessName, ownerName, nib, businessType, address, rtRw, contact, status, startDate, employeeCount, description, imageUrl } = validatedFields.data;
  const umkmId = id.replace('umkm-','');

  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE umkm SET businessName = ?, ownerName = ?, nib = ?, businessType = ?, address = ?, rtRw = ?, contact = ?, status = ?, startDate = ?, employeeCount = ?, description = ?, imageUrl = ? WHERE id = ?';
    await connection.execute(query, [
        businessName,
        ownerName,
        nib || null,
        businessType,
        address,
        rtRw,
        contact,
        status,
        startDate || new Date().toISOString().split('T')[0],
        employeeCount || 0,
        description || null,
        imageUrl || 'https://placehold.co/600x400.png',
        umkmId
    ]);
    connection.release();
  } catch (error) {
     console.error('Database Error:', error);
    throw new Error('Gagal memperbarui data UMKM.');
  }


  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}

export async function deleteUmkm(id: string) {
    const umkmId = id.replace('umkm-','');
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM umkm WHERE id = ?';
        await connection.execute(query, [umkmId]);
        connection.release();
        revalidatePath("/dashboard/umkm");
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal menghapus data UMKM.');
    }
}
