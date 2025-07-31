'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { umkmSchema, signupSchema } from "@/lib/schema";
import pool from './db';

// --- USER ACTIONS ---

export async function createUser(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const connection = await pool.getConnection();

    // Check if user already exists
    const [existingUsers]: [any[], any] = await connection.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      connection.release();
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }
    
    // Insert new user
    const query = 'INSERT INTO users (name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)';
    await connection.execute(query, [
        name,
        email,
        hashedPassword,
        "Admin Desa", // Default role for signup
        "-",
        `https://placehold.co/100x100.png?text=${name.charAt(0)}`
    ]);
    
    connection.release();
  } catch (error) {
    console.error('Database Error:', error);
    if (error instanceof Error) {
        // Rethrow custom error messages or a generic one
        throw new Error(error.message || 'Gagal membuat akun pengguna.');
    }
    throw new Error('Gagal membuat akun pengguna karena kesalahan tidak diketahui.');
  }
}


// --- UMKM ACTIONS ---

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
