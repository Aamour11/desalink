
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema } from "@/lib/schema";
import pool from './db';
import type { UMKM, User } from "@/lib/types";

// --- USER ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid. Silakan periksa kembali.");
  }
  
  const { email, password } = validatedFields.data;

  try {
    const connection = await pool.getConnection();
    const [users]: [any[], any] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (users.length === 0) {
      throw new Error("Email atau kata sandi salah.");
    }

    const user = users[0];
    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordsMatch) {
      throw new Error("Email atau kata sandi salah.");
    }

    // In a real app, you'd create a session here.
    // For now, successfully returning means login is successful.
    return { success: true };
    
  } catch (error) {
     if (error instanceof Error) {
        // Rethrow custom error messages or a generic one
        throw new Error(error.message || 'Terjadi kesalahan saat proses login.');
    }
    throw new Error('Terjadi kesalahan yang tidak diketahui.');
  }
}

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


export async function addNewUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name, email, password, role, rtRw } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await pool.getConnection();

        const [existingUsers]: [any[], any] = await connection.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            connection.release();
            throw new Error("Email sudah terdaftar untuk pengguna lain.");
        }

        const query = 'INSERT INTO users (name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)';
        await connection.execute(query, [
            name,
            email,
            hashedPassword,
            role,
            role === "Admin Desa" ? "-" : rtRw,
             `https://placehold.co/100x100.png?text=${name.charAt(0)}`
        ]);

        connection.release();
        revalidatePath("/dashboard/users");
    } catch (error) {
        console.error('Database Error:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Gagal menambahkan pengguna baru.');
        }
        throw new Error('Gagal menambahkan pengguna baru karena kesalahan tidak diketahui.');
    }
}

export async function updateUser(id: string, values: z.infer<typeof editUserFormSchema>) {
    const userId = id.replace('user-', '');
    const validatedFields = editUserFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name, role, rtRw, password } = validatedFields.data;

    try {
        const connection = await pool.getConnection();

        if (password) {
            // Update with new password
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'UPDATE users SET name = ?, role = ?, rtRw = ?, password_hash = ? WHERE id = ?';
            await connection.execute(query, [name, role, role === 'Admin Desa' ? '-' : rtRw, hashedPassword, userId]);
        } else {
            // Update without changing password
            const query = 'UPDATE users SET name = ?, role = ?, rtRw = ? WHERE id = ?';
            await connection.execute(query, [name, role, role === 'Admin Desa' ? '-' : rtRw, userId]);
        }

        connection.release();
        revalidatePath("/dashboard/users");
        revalidatePath(`/dashboard/users/${id}/edit`);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal memperbarui data pengguna.');
    }
}

export async function deleteUser(id: string) {
    const userId = id.replace('user-', '');
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM users WHERE id = ?';
        await connection.execute(query, [userId]);
        connection.release();
        revalidatePath("/dashboard/users");
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal menghapus pengguna.');
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

// --- DATA FETCHING ---
export async function getUmkmData(): Promise<UMKM[]> {
    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.execute('SELECT * FROM umkm ORDER BY createdAt DESC');
        connection.release();
        
        return rows.map(row => ({
            ...row,
            id: `umkm-${row.id}`,
            startDate: new Date(row.startDate).toISOString().split('T')[0]
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal mengambil data UMKM.');
    }
}

export async function getUsersData(): Promise<User[]> {
    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.execute('SELECT id, name, email, role, rtRw, avatarUrl FROM users ORDER BY name');
        connection.release();
         return rows.map(row => ({
            ...row,
            id: `user-${row.id}`,
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal mengambil data Pengguna.');
    }
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkmId = id.replace('umkm-','');
    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.execute('SELECT * FROM umkm WHERE id = ?', [umkmId]);
        connection.release();

        if (rows.length === 0) return null;
        
        const row = rows[0];
        return {
             ...row,
            id: `umkm-${row.id}`,
            startDate: new Date(row.startDate).toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal mengambil data UMKM by ID.');
    }
}


export async function getUserById(id: string): Promise<User | null> {
    const userId = id.replace('user-','');
    try {
        const connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.execute('SELECT id, name, email, role, rtRw, avatarUrl FROM users WHERE id = ?', [userId]);
        connection.release();

        if (rows.length === 0) return null;
        
        const row = rows[0];
        return {
             ...row,
            id: `user-${row.id}`,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal mengambil data Pengguna by ID.');
    }
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  if (!rtRw || rtRw === '-') return [];
  try {
    const connection = await pool.getConnection();
    const [rows]: [any[], any] = await connection.execute('SELECT * FROM umkm WHERE rtRw = ? ORDER BY createdAt DESC', [rtRw]);
    connection.release();
    return rows.map(row => ({
      ...row,
      id: `umkm-${row.id}`,
      startDate: new Date(row.startDate).toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data UMKM yang dikelola.');
  }
}
