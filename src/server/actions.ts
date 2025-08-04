
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import { mockUsers } from "@/server/db";
import { mockUmkm, mockAnnouncements } from "@/lib/data";
import type { UMKM, User, Announcement } from "@/lib/types";
import { unlink, stat } from "fs/promises";
import { join } from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-that-is-long-enough";
const JWT_EXPIRES_IN = "1d";

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid. Silakan periksa kembali.");
  }
  
  const { email, password } = validatedFields.data;

  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error("Email atau kata sandi salah.");
  }
  
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordsMatch) {
    throw new Error("Email atau kata sandi salah.");
  }

  // Create a token payload without the password hash
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
    // If token is invalid, delete it to prevent loops
    cookies().delete("session");
    return null;
  }
}

// --- USER ACTIONS ---

export async function createUser(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  
  const { name, email, password } = validatedFields.data;

  if (mockUsers.find(u => u.email === email)) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password_hash: hashedPassword,
    role: "Admin Desa",
    rtRw: "-",
    avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`
  };
  mockUsers.push(newUser);
  revalidatePath("/dashboard/users");
}

export async function createPetugasUser(values: z.infer<typeof signupPetugasSchema>) {
  const validatedFields = signupPetugasSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");

  const { name, email, password, rtRw } = validatedFields.data;
  if (mockUsers.find(u => u.email === email)) {
      throw new Error("Email sudah terdaftar.");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password_hash: hashedPassword,
    role: "Petugas RT/RW",
    rtRw: rtRw,
    avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`
  };
  mockUsers.push(newUser);
  revalidatePath("/dashboard/users");
}

export async function addNewUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");

    const { name, email, password, role, rtRw } = validatedFields.data;
    if (mockUsers.find(u => u.email === email)) {
        throw new Error("Email sudah terdaftar untuk pengguna lain.");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password_hash: hashedPassword,
        role,
        rtRw: role === 'Admin Desa' ? '-' : rtRw || '',
        avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`
    };
    mockUsers.push(newUser);
    revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, values: z.infer<typeof editUserFormSchema>) {
    const validatedFields = editUserFormSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");

    const { name, role, rtRw, password } = validatedFields.data;
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error("Pengguna tidak ditemukan.");

    const updatedUser = { ...mockUsers[userIndex], name, role, rtRw: role === 'Admin Desa' ? '-' : rtRw || '' };
    if (password) {
        updatedUser.password_hash = await bcrypt.hash(password, 10);
    }
    mockUsers[userIndex] = updatedUser;

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(userId: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) throw new Error("Anda tidak dapat menghapus akun Anda sendiri.");

    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Pengguna tidak ditemukan.');

    mockUsers.splice(index, 1);
    revalidatePath("/dashboard/users");
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    const validatedFields = updateProfileSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('Pengguna tidak ditemukan.');

    mockUsers[userIndex].name = values.data.name;
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/users');
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
    const validatedFields = updatePasswordSchema.safeParse(values);
    if (!validatedFields.success) throw new Error("Data tidak valid.");
    
    const { currentPassword, newPassword } = validatedFields.data;
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("Pengguna tidak ditemukan.");

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordsMatch) throw new Error("Kata sandi saat ini salah.");

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    mockUsers[userIndex].password_hash = await bcrypt.hash(newPassword, 10);
}

// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Anda harus login untuk melakukan tindakan ini.");
  if (currentUser.role !== "Petugas RT/RW") throw new Error("Hanya Petugas RT/RW yang dapat menambah data UMKM.");

  const validatedFields = umkmSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  if (validatedFields.data.rtRw !== currentUser.rtRw) throw new Error("Anda hanya dapat menambah data untuk wilayah Anda sendiri.");

  const newUmkm: UMKM = {
    id: `umkm-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...validatedFields.data,
    employeeCount: validatedFields.data.employeeCount || 0,
    imageUrl: validatedFields.data.imageUrl || 'https://placehold.co/600x400.png'
  };

  mockUmkm.unshift(newUmkm);
  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(id: string, values: z.infer<typeof umkmSchema>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Anda harus login untuk melakukan tindakan ini.");
  if (currentUser.role !== 'Petugas RT/RW') throw new Error("Anda tidak memiliki izin untuk mengedit data UMKM.");

  const umkmToUpdate = mockUmkm.find(u => u.id === id);
  if (!umkmToUpdate) throw new Error("UMKM tidak ditemukan.");
  if (currentUser.rtRw !== umkmToUpdate.rtRw) throw new Error("Anda tidak memiliki izin untuk mengedit UMKM ini.");

  const validatedFields = umkmSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");

  const umkmIndex = mockUmkm.findIndex(u => u.id === id);
  if (umkmIndex === -1) throw new Error("UMKM tidak ditemukan.");
  
  mockUmkm[umkmIndex] = { ...mockUmkm[umkmIndex], ...validatedFields.data };
  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}

export async function deleteUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Anda harus login.");
    if (currentUser.role !== 'Petugas RT/RW') throw new Error("Hanya Petugas RT/RW yang berwenang yang dapat menghapus data.");

    const umkmIndex = mockUmkm.findIndex(u => u.id === id);
    if (umkmIndex === -1) throw new Error("UMKM tidak ditemukan.");
    
    const umkmData = mockUmkm[umkmIndex];
    if (currentUser.rtRw !== umkmData.rtRw) throw new Error("Anda tidak memiliki izin untuk menghapus UMKM ini.");

    mockUmkm.splice(umkmIndex, 1);
    revalidatePath("/dashboard/umkm");
}

export async function deactivateUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin Desa') throw new Error("Hanya Admin Desa yang dapat menonaktifkan UMKM.");

    const umkmIndex = mockUmkm.findIndex(u => u.id === id);
    if (umkmIndex === -1) throw new Error("UMKM tidak ditemukan.");

    mockUmkm[umkmIndex].status = "tidak aktif";
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
        return mockUmkm.filter(u => u.rtRw === user.rtRw);
    }
    if (user.role === 'Admin Desa') {
      return [...mockUmkm].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [];
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    const user = await getCurrentUser();
    if (user?.role !== 'Admin Desa') return [];
    // Return all users without their password hashes
    return mockUsers.map(({ password_hash, ...userWithoutPassword }) => userWithoutPassword);
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkm = mockUmkm.find(u => u.id === id);
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
    
    const targetUser = mockUsers.find(u => u.id === id);
    if (!targetUser) return null;
    
    const { password_hash, ...userWithoutPassword } = targetUser;
    return userWithoutPassword;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  const user = await getCurrentUser();
  if (user?.role !== 'Admin Desa') return [];
  if (!rtRw || rtRw === '-') return [];
  return mockUmkm.filter(u => u.rtRw === rtRw);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}
