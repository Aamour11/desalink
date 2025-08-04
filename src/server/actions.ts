
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { executeQuery } from "@/lib/db";

import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement, Management } from "@/lib/types";
import { mockAnnouncements } from "@/lib/data";

const SESSION_COOKIE_NAME = "session_id";

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  
  const { email, password } = validatedFields.data;

  const users = await executeQuery<User[]>("SELECT * FROM users WHERE email = ?", [email]);
  const user = users[0];

  if (!user) {
    console.log(`Login failed: No user found for email ${email}`);
    throw new Error("Email atau kata sandi salah.");
  }
  
  if (password !== user.password_hash) {
    console.log(`Login failed: Password mismatch for email ${email}`);
    throw new Error("Email atau kata sandi salah.");
  }

  // This part is now bypassed at the layout level
}

export async function signOut() {
  // This part is now bypassed at the layout level
}

export async function getCurrentUser(): Promise<Omit<User, 'password_hash'> | null> {
  // Return null to activate the mock user bypass in the layout
  return null;
}

// --- USER ACTIONS ---

async function createUserAction(values: z.infer<typeof signupSchema | typeof signupPetugasSchema>, role: "Admin Desa" | "Petugas RT/RW", rtRw?: string) {
    const { name, email, password } = values;

    const existingUsers = await executeQuery<any[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
        throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }

    const plainPassword = password;
    const userId = `user-${Date.now()}`;
    const avatarUrl = `https://placehold.co/100x100.png?text=${name.charAt(0)}`;
    const finalRtRw = role === "Admin Desa" ? '-' : rtRw;

    await executeQuery(
        "INSERT INTO users (id, name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, name, email, plainPassword, role, finalRtRw, avatarUrl]
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
        await executeQuery("UPDATE users SET name = ?, role = ?, rtRw = ?, password_hash = ? WHERE id = ?", [name, role, finalRtRw, password, id]);
    } else {
        await executeQuery("UPDATE users SET name = ?, role = ?, rtRw = ? WHERE id = ?", [name, role, finalRtRw, id]);
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(userId: string) {
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
    
    const users = await executeQuery<User[]>("SELECT password_hash FROM users WHERE id = ?", [userId]);
    const user = users[0];
    if (!user) throw new Error("Pengguna tidak ditemukan.");

    if (currentPassword !== user.password_hash) {
      throw new Error("Kata sandi saat ini salah.");
    }
    
    await executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [newPassword, userId]);
}


// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const validatedFields = umkmSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Data tidak valid.");
  
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
    await executeQuery("DELETE FROM umkm WHERE id = ?", [id]);
    revalidatePath("/dashboard/umkm");
}

export async function deactivateUmkm(id: string) {
    await executeQuery("UPDATE umkm SET status = ? WHERE id = ?", ["tidak aktif", id]);
    revalidatePath("/dashboard/umkm");
    revalidatePath(`/dashboard/structure`);
}

// --- ANNOUNCEMENT ACTIONS ---

export async function sendAnnouncement(message: string) {
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
  // Bypassing user check, fetching all data
  return await executeQuery<UMKM[]>("SELECT * FROM umkm ORDER BY createdAt DESC");
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    return await executeQuery<Omit<User, 'password_hash'>[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users");
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkms = await executeQuery<UMKM[]>("SELECT * FROM umkm WHERE id = ?", [id]);
    return umkms[0] || null;
}

export async function getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const users = await executeQuery<Omit<User, 'password_hash'>[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users WHERE id = ?", [id]);
    return users[0] || null;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  if (!rtRw || rtRw === '-') return [];
  return await executeQuery<UMKM[]>("SELECT * FROM umkm WHERE rtRw = ?", [rtRw]);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    // This remains mock as there is no announcements table
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}

export async function getManagementData(): Promise<Management[]> {
    return await executeQuery<Management[]>("SELECT * FROM management ORDER BY id");
}
