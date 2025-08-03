
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema } from "@/lib/schema";
import pool from './db';
import type { UMKM, User } from "@/lib/types";
import { unlink, stat } from "fs/promises";
import { join } from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = "1d";

// --- AUTH ACTIONS ---

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
    
    const tokenPayload: User = {
      id: `user-${user.id}`, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      rtRw: user.rtRw,
      avatarUrl: user.avatarUrl,
    };
    
    // Create JWT
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const cookieStore = await cookies();
    // Set cookie
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: true };
    
  } catch (error) {
     if (error instanceof Error) {
        throw new Error(error.message || 'Terjadi kesalahan saat proses login.');
    }
    throw new Error('Terjadi kesalahan yang tidak diketahui.');
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    // Return a mock admin user if no session is found for development purposes
    console.log("No session found, returning mock user.");
    return {
        id: "user-1",
        name: "Admin Desa (Dev)",
        email: "admin@desa.com",
        role: "Admin Desa",
        rtRw: "-",
        avatarUrl: "https://placehold.co/100x100.png?text=A",
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error) {
     // If token is invalid, fall back to mock user for development
    console.log("Invalid token, returning mock user.");
     return {
        id: "user-1",
        name: "Admin Desa (Dev)",
        email: "admin@desa.com",
        role: "Admin Desa",
        rtRw: "-",
        avatarUrl: "https://placehold.co/100x100.png?text=A",
    };
  }
}

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

    const [existingUsers]: [any[], any] = await connection.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      connection.release();
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }
    
    const query = 'INSERT INTO users (name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?)';
    await connection.execute(query, [
        name,
        email,
        hashedPassword,
        "Admin Desa",
        "-",
        `https://placehold.co/100x100.png?text=${name.charAt(0)}`
    ]);
    
    connection.release();
  } catch (error) {
    if (error instanceof Error) {
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
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'UPDATE users SET name = ?, role = ?, rtRw = ?, password_hash = ? WHERE id = ?';
            await connection.execute(query, [name, role, role === 'Admin Desa' ? '-' : rtRw, hashedPassword, userId]);
        } else {
            const query = 'UPDATE users SET name = ?, role = ?, rtRw = ? WHERE id = ?';
            await connection.execute(query, [name, role, role === 'Admin Desa' ? '-' : rtRw, userId]);
        }

        connection.release();
        revalidatePath("/dashboard/users");
        revalidatePath(`/dashboard/users/${id}`);
        revalidatePath(`/dashboard/users/${id}/edit`);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal memperbarui data pengguna.');
    }
}

export async function deleteUser(userId: string) {
    const id = userId.replace('user-', '');
     if (id === '1') {
      throw new Error('Admin utama tidak dapat dihapus.');
    }
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM users WHERE id = ?';
        await connection.execute(query, [id]);
        connection.release();
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal menghapus pengguna.');
    }
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    const id = userId.replace('user-', '');
    const validatedFields = updateProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name } = validatedFields.data;

    try {
        const connection = await pool.getConnection();
        await connection.execute('UPDATE users SET name = ? WHERE id = ?', [name, id]);
        connection.release();
        revalidatePath('/dashboard/settings');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal memperbarui profil.');
    }
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
    const id = userId.replace('user-', '');
    const validatedFields = updatePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }
    
    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const connection = await pool.getConnection();
        const [users]: [any[], any] = await connection.execute('SELECT password_hash FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            connection.release();
            throw new Error("Pengguna tidak ditemukan.");
        }

        const user = users[0];
        const passwordsMatch = await bcrypt.compare(currentPassword, user.password_hash);

        if (!passwordsMatch) {
            connection.release();
            throw new Error("Kata sandi saat ini salah.");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, id]);
        
        connection.release();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        console.error('Database Error:', error);
        throw new Error('Gagal mengubah kata sandi.');
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
  values: z.infer<typeof umkmSchema>,
  oldImageUrl?: string | null
) {
  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }
  
  const { businessName, ownerName, nib, businessType, address, rtRw, contact, status, startDate, employeeCount, description, imageUrl } = validatedFields.data;
  const umkmId = id.replace('umkm-','');

  // Logic to delete old image if a new one is uploaded
  if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
    // Avoid deleting placeholder images
    if (!oldImageUrl.includes("placehold.co")) {
      try {
        const oldImagePath = join(process.cwd(), "public", oldImageUrl);
        // Check if file exists before trying to delete
        await stat(oldImagePath);
        await unlink(oldImagePath);
        console.log(`Successfully deleted old image: ${oldImagePath}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // File doesn't exist, which is fine.
          console.log(`Old image not found, skipping deletion: ${oldImageUrl}`);
        } else {
          // Other error (e.g., permissions)
          console.error("Error deleting old image:", error);
        }
      }
    }
  }


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
        const umkmData = await getUmkmById(id);
        
        const connection = await pool.getConnection();
        const query = 'DELETE FROM umkm WHERE id = ?';
        await connection.execute(query, [umkmId]);
        connection.release();

        // Delete the associated image after successful DB deletion
        if (umkmData?.imageUrl && !umkmData.imageUrl.includes("placehold.co")) {
             try {
                const imagePath = join(process.cwd(), "public", umkmData.imageUrl);
                await stat(imagePath);
                await unlink(imagePath);
                console.log(`Successfully deleted image for UMKM ID ${id}: ${imagePath}`);
            } catch (error: any) {
                 if (error.code === 'ENOENT') {
                    console.log(`Image not found, skipping deletion: ${umkmData.imageUrl}`);
                } else {
                    console.error("Error deleting image file:", error);
                }
            }
        }
        
        revalidatePath("/dashboard/umkm");
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal menghapus data UMKM.');
    }
}

// --- DATA FETCHING ---
export async function getUmkmData(): Promise<UMKM[]> {
    const user = await getCurrentUser();
    
    try {
        const connection = await pool.getConnection();
        let query = 'SELECT * FROM umkm ORDER BY createdAt DESC';
        let params: string[] = [];

        if (user?.role === 'Petugas RT/RW' && user.rtRw) {
            query = 'SELECT * FROM umkm WHERE rtRw = ? ORDER BY createdAt DESC';
            params.push(user.rtRw);
        }
        
        const [rows]: [any[], any] = await connection.execute(query, params);
        connection.release();
        
        return rows.map(row => ({
            ...row,
            id: `umkm-${row.id}`,
            startDate: row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : null
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Gagal mengambil data UMKM.');
    }
}

export async function getUsersData(): Promise<User[]> {
    const user = await getCurrentUser();
    if (user?.role !== 'Admin Desa') {
        return [];
    }
    
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
      startDate: row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : null,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data UMKM yang dikelola.');
  }
}
