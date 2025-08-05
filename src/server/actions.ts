
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies, headers } from 'next/headers';
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement, Management } from "@/lib/types";
import { mockAnnouncements, mockManagement, mockUmkm } from "@/lib/data";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION = 60 * 60 * 24 * 7; // One week in seconds

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  const { email, password } = values;

  const users = await executeQuery<User[]>("SELECT * FROM users WHERE email = ?", [email]);
  const user = users[0];

  if (!user) {
    throw new Error("Email atau kata sandi salah.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Email atau kata sandi salah.");
  }
  
  // Exclude password_hash from the object that might be returned or used elsewhere
  const { password_hash, ...userSafeData } = user;

  // Set session cookie
  cookies().set(SESSION_COOKIE_NAME, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_DURATION,
      path: '/',
  });

  return userSafeData;
}

export async function signOut() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<Omit<User, 'password_hash'> | null> {
    const sessionUserId = cookies().get(SESSION_COOKIE_NAME)?.value;
    const simulationUserId = headers().get('x-simulation-user-id');

    if (!sessionUserId) {
       return null;
    }

    const originalUsers = await executeQuery<User[]>("SELECT * FROM users WHERE id = ?", [sessionUserId]);
    const originalUser = originalUsers[0];
    
    if (!originalUser) {
        cookies().delete(SESSION_COOKIE_NAME);
        return null;
    }
    
    // Admin simulation logic
    if (originalUser.role === 'Admin Desa' && simulationUserId) {
      const simulatedUsers = await executeQuery<User[]>("SELECT * FROM users WHERE id = ? AND role = 'Petugas RT/RW'", [simulationUserId]);
      const simulatedUser = simulatedUsers[0];
      if (simulatedUser) {
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { password_hash, ...safeSimulatedUser } = simulatedUser;
         return safeSimulatedUser;
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...safeOriginalUser } = originalUser;
    return safeOriginalUser;
}

// --- USER ACTIONS ---
async function createUserAction(values: z.infer<typeof signupSchema | typeof signupPetugasSchema>, role: "Admin Desa" | "Petugas RT/RW", rtRw: string = '-') {
    const { name, email, password } = values;

    const existingUsers = await executeQuery<User[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
        throw new Error("Email sudah terdaftar.");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${uuidv4()}`;
    const avatarUrl = `https://placehold.co/100x100.png?text=${name.charAt(0)}`;
    
    await executeQuery(
        "INSERT INTO users (id, name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, name, email, hashedPassword, role, rtRw, avatarUrl]
    );

    revalidatePath("/dashboard/users");
}

export async function createUser(values: z.infer<typeof signupSchema>) {
    await createUserAction(values, "Admin Desa");
}

export async function createPetugasUser(values: z.infer<typeof signupPetugasSchema>) {
    await createUserAction(values, "Petugas RT/RW", values.rtRw);
}

export async function addNewUser(values: z.infer<typeof userFormSchema>) {
   await createUserAction(values, values.role, values.rtRw);
}

export async function updateUser(id: string, values: z.infer<typeof editUserFormSchema>) {
    const { name, role, rtRw, password } = values;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await executeQuery(
            "UPDATE users SET name = ?, role = ?, rtRw = ?, password_hash = ? WHERE id = ?",
            [name, role, rtRw || '-', hashedPassword, id]
        );
    } else {
        await executeQuery(
            "UPDATE users SET name = ?, role = ?, rtRw = ? WHERE id = ?",
            [name, role, rtRw || '-', id]
        );
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(userId: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) {
        throw new Error("Anda tidak dapat menghapus akun Anda sendiri.");
    }
    await executeQuery("DELETE FROM users WHERE id = ?", [userId]);
    revalidatePath("/dashboard/users");
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    await executeQuery("UPDATE users SET name = ? WHERE id = ?", [values.name, userId]);
    revalidatePath('/dashboard/settings');
    revalidatePath(`/dashboard/users/${userId}`);
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
    const { currentPassword, newPassword } = values;
    const users = await executeQuery<User[]>("SELECT password_hash FROM users WHERE id = ?", [userId]);
    const user = users[0];

    if (!user) {
        throw new Error("Pengguna tidak ditemukan.");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
        throw new Error("Kata sandi saat ini salah.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [hashedNewPassword, userId]);
}


// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const umkmId = `umkm-${uuidv4()}`;
  await executeQuery(
    "INSERT INTO umkm (id, businessName, ownerName, nib, businessType, address, rtRw, contact, status, legality, startDate, endDate, employeeCount, description, imageUrl, legalityDocumentUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
        umkmId,
        values.businessName,
        values.ownerName,
        values.nib,
        values.businessType,
        values.address,
        values.rtRw,
        values.contact,
        values.status,
        values.legality,
        values.startDate || null,
        values.endDate || null,
        values.employeeCount,
        values.description,
        values.imageUrl,
        values.legalityDocumentUrl
    ]
  );
  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(id: string, values: z.infer<typeof umkmSchema>) {
    await executeQuery(
    "UPDATE umkm SET businessName = ?, ownerName = ?, nib = ?, businessType = ?, address = ?, rtRw = ?, contact = ?, status = ?, legality = ?, startDate = ?, endDate = ?, employeeCount = ?, description = ?, imageUrl = ?, legalityDocumentUrl = ? WHERE id = ?",
    [
        values.businessName,
        values.ownerName,
        values.nib,
        values.businessType,
        values.address,
        values.rtRw,
        values.contact,
        values.status,
        values.legality,
        values.startDate || null,
        values.endDate || null,
        values.employeeCount,
        values.description,
        values.imageUrl,
        values.legalityDocumentUrl,
        id
    ]
  );
  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}


export async function deleteUmkm(id: string) {
    await executeQuery("DELETE FROM umkm WHERE id = ?", [id]);
    revalidatePath("/dashboard/umkm");
}

export async function deactivateUmkm(id: string) {
    await executeQuery("UPDATE umkm SET status = 'tidak aktif' WHERE id = ?", [id]);
    revalidatePath("/dashboard/umkm");
    revalidatePath(`/dashboard/structure`);
}

// --- ANNOUNCEMENT ACTIONS ---

export async function sendAnnouncement(message: string) {
    // This remains mock as there's no announcements table
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

export async function getUmkmData(forceAll = false): Promise<UMKM[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  if (user.role === 'Petugas RT/RW' && !forceAll) {
    return executeQuery<UMKM[]>("SELECT * FROM umkm WHERE rtRw = ? ORDER BY createdAt DESC", [user.rtRw]);
  }
  
  // Admin gets all
  return executeQuery<UMKM[]>("SELECT * FROM umkm ORDER BY createdAt DESC");
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await executeQuery<User[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users ORDER BY name ASC");
    return users;
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkms = await executeQuery<UMKM[]>("SELECT * FROM umkm WHERE id = ?", [id]);
    return umkms[0] || null;
}

export async function getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const users = await executeQuery<User[]>("SELECT id, name, email, role, rtRw, avatarUrl FROM users WHERE id = ?", [id]);
    return users[0] || null;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  return executeQuery<UMKM[]>("SELECT * FROM umkm WHERE rtRw = ?", [rtRw]);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    // This remains mock as there's no announcements table
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}

export async function getManagementData(): Promise<Management[]> {
    // This remains mock as there's no management table
    return mockManagement;
}
