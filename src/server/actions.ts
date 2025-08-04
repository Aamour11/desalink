
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2";

import pool from "@/lib/db";
import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement } from "@/lib/types";
import { mockAnnouncements } from "@/lib/data"; // Announcements can remain mock for now

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-that-is-long-enough";
const JWT_EXPIRES_IN = "1d";

// Helper function to execute queries
async function executeQuery<T>(query: string, values: any[] = []): Promise<T> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, values);
    return results as T;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw new Error("Terjadi kesalahan pada server database.");
  } finally {
    if (connection) connection.release();
  }
}

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  
  const { email, password } = validatedFields.data;

  const users = await executeQuery<User[] & RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);
  const user = users[0];

  if (!user) throw new Error("Email atau kata sandi salah.");
  
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordsMatch) throw new Error("Email atau kata sandi salah.");

  const tokenPayload = {
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role,
    rtRw: user.rtRw,
    avatarUrl: user.avatarUrl,
  };
  
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: true };
}

export async function signOut() {
  cookies().delete("session");
}

export async function getCurrentUser(): Promise<Omit<User, 'password_hash'> | null> {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Omit<User, 'password_hash'>;
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    cookies().delete("session");
    return null;
  }
}

// --- USER ACTIONS ---

async function
 
createUserAction(values: z.infer<typeof signupSchema | typeof signupPetugasSchema>, role: "Admin Desa" | "Petugas RT/RW", rtRw?: string) {
    const { name, email, password } = values;

    const existingUsers = await executeQuery<any[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
        throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const avatarUrl = `https://placehold.co/100x100.png?text=${name.charAt(0)}`;
    const finalRtRw = role === "Admin Desa" ? '-' : rtRw;

    await executeQuery(
        "INSERT INTO users (id, name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, name, email, hashedPassword, role, finalRtRw, avatarUrl]
    );

    revalidatePath("/dashboard/users");
}


export async function createUser(values: z.infer<typeof signupSchema>) {
    const validatedFields = signupSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");
    await createUserAction(validatedFields.data, "Admin Desa");
}

export async function createPetugasUser(values: z.infer<typeof signupPetugasSchema>) {
    const validatedFields = signupPetugasSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");
    await createUserAction(validatedFields.data, "Petugas RT/RW", validatedFields.data.rtRw);
}


export async function addNewUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");

    await createUserAction(validatedFields.data, validatedFields.data.role, validatedFields.data.rtRw);
}

export async function updateUser(id: string, values: z.infer<typeof editUserFormSchema>) {
    const validatedFields = editUserFormSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");

    const { name, role, rtRw, password } = validatedFields.data;
    const finalRtRw = role === 'Admin Desa' ? '-' : rtRw || '';
    
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await executeQuery("UPDATE users SET name = ?, role = ?, rtRw = ?, password_hash = ? WHERE id = ?", [name, role, finalRtRw, hashedPassword, id]);
    } else {
        await executeQuery("UPDATE users SET name = ?, role = ?, rtRw = ? WHERE id = ?", [name, role, finalRtRw, id]);
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(userId: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) throw new Error("Anda tidak dapat menghapus akun Anda sendiri.");

    await executeQuery("DELETE FROM users WHERE id = ?", [userId]);
    revalidatePath("/dashboard/users");
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    const validatedFields = updateProfileSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");
    
    const { name } = validatedFields.data;
    await executeQuery("UPDATE users SET name = ? WHERE id = ?", [name, userId]);
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/users');
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
    const validatedFields = updatePasswordSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");
    
    const { currentPassword, newPassword } = validatedFields.data;
    
    const users = await executeQuery<User[] & RowDataPacket[]>("SELECT password_hash FROM users WHERE id = ?", [userId]);
    const user = users[0];
    if (!user) throw new Error("Pengguna tidak ditemukan.");

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordsMatch) throw new Error("Kata sandi saat ini salah.");

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [newHashedPassword, userId]);
}


// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Anda harus login untuk melakukan tindakan ini.");
  if (currentUser.role !== "Petugas RT/RW") throw new Error("Hanya Petugas RT/RW yang dapat menambah data UMKM.");

  const validatedFields = umkmSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  if (validatedFields.data.rtRw !== currentUser.rtRw) throw new Error("Anda hanya dapat menambah data untuk wilayah Anda sendiri.");

  const { businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate, employeeCount, description, imageUrl, legalityDocumentUrl } = validatedFields.data;
  const umkmId = `umkm-${Date.now()}`;
  const finalImageUrl = imageUrl || 'https://placehold.co/600x400.png';

  const query = `
    INSERT INTO umkm (id, businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate, employeeCount, description, imageUrl, legalityDocumentUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await executeQuery(query, [umkmId, businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate || null, employeeCount || 0, description, finalImageUrl, legalityDocumentUrl]);
  
  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(id: string, values: z.infer<typeof umkmSchema>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Anda harus login untuk melakukan tindakan ini.");
  if (currentUser.role !== 'Petugas RT/RW') throw new Error("Anda tidak memiliki izin untuk mengedit data UMKM.");

  const umkms = await executeQuery<UMKM[] & RowDataPacket[]>("SELECT rtRw FROM umkm WHERE id = ?", [id]);
  const umkmToUpdate = umkms[0];
  if (!umkmToUpdate) throw new Error("UMKM tidak ditemukan.");
  if (currentUser.rtRw !== umkmToUpdate.rtRw) throw new Error("Anda tidak memiliki izin untuk mengedit UMKM ini.");

  const validatedFields = umkmSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");

  const { businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate, employeeCount, description, imageUrl, legalityDocumentUrl } = validatedFields.data;
  
  const query = `
    UPDATE umkm SET
      businessName = ?, ownerName = ?, nib = ?, businessType = ?, address = ?, rtRw = ?, contact = ?, status = ?, legality = ?, startDate = ?, employeeCount = ?, description = ?, imageUrl = ?, legalityDocumentUrl = ?
    WHERE id = ?
  `;
  await executeQuery(query, [businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate || null, employeeCount, description, imageUrl, legalityDocumentUrl, id]);

  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}


export async function deleteUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Anda harus login.");
    if (currentUser.role !== 'Petugas RT/RW') throw new Error("Hanya Petugas RT/RW yang berwenang yang dapat menghapus data.");

    const umkms = await executeQuery<UMKM[] & RowDataPacket[]>("SELECT rtRw FROM umkm WHERE id = ?", [id]);
    const umkmData = umkms[0];
    if (!umkmData) throw new Error("UMKM tidak ditemukan.");
    if (currentUser.rtRw !== umkmData.rtRw) throw new Error("Anda tidak memiliki izin untuk menghapus UMKM ini.");

    await executeQuery("DELETE FROM umkm WHERE id = ?", [id]);
    revalidatePath("/dashboard/umkm");
}

export async function deactivateUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin Desa') throw new Error("Hanya Admin Desa yang dapat menonaktifkan UMKM.");

    await executeQuery("UPDATE umkm SET status = ? WHERE id = ?", ["tidak aktif", id]);
    revalidatePath("/dashboard/umkm");
    revalidatePath(`/dashboard/structure`);
}

// --- ANNOUNCEMENT ACTIONS ---

export async function sendAnnouncement(message: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin Desa') throw new Error("Hanya Admin Desa yang dapat mengirim pengumuman.");
    if (!message || message.trim().length === 0) throw new Error("Pesan tidak boleh kosong.");

    const newAnnouncement: Announcement = {
        id: `ann-${Date.now()}`,
        message: message.trim(),
        createdAt: new Date().toISOString(),
    };
    mockAnnouncements.unshift(newAnnouncement);
    revalidatePath("/dashboard");
}

// --- DATA FETCHING ---

export async function getUmkmData(): Promise<UMKM[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    if (user.role === 'Petugas RT/RW' && user.rtRw) {
        return await executeQuery<UMKM[] & RowDataPacket[]>("SELECT * FROM umkm WHERE rtRw = ? ORDER BY createdAt DESC", [user.rtRw]);
    }
    if (user.role === 'Admin Desa') {
      return await executeQuery<UMKM[] & RowDataPacket[]>("SELECT * FROM umkm ORDER BY createdAt DESC");
    }
    return [];
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    const user = await getCurrentUser();
    if (user?.role !== 'Admin Desa') return [];
    
    return await executeQuery<Omit<User, 'password_hash'>[] & RowDataPacket[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users");
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkms = await executeQuery<UMKM[] & RowDataPacket[]>("SELECT * FROM umkm WHERE id = ?", [id]);
    const umkm = umkms[0];
    if (!umkm) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    if (user.role === 'Petugas RT/RW' && umkm.rtRw !== user.rtRw) return null;
    return umkm;
}

export async function getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    if (currentUser.id !== id && currentUser.role !== 'Admin Desa') return null;
    
    const users = await executeQuery<Omit<User, 'password_hash'>[] & RowDataPacket[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users WHERE id = ?", [id]);
    return users[0] || null;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  const user = await getCurrentUser();
  if (user?.role !== 'Admin Desa') return [];
  if (!rtRw || rtRw === '-') return [];
  return await executeQuery<UMKM[] & RowDataPacket[]>("SELECT * FROM umkm WHERE rtRw = ?", [rtRw]);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    // This remains mock as there is no announcements table
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}
