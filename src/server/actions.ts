
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies, headers } from 'next/headers';
import { executeQuery } from "@/lib/db";

import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement, Management } from "@/lib/types";
import { mockAnnouncements, mockManagement, mockUmkm, mockUsers } from "@/lib/data";

const SESSION_COOKIE_NAME = "session_id";
const ROLE_COOKIE_NAME = "activeRole";

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  // In a real app, you'd also check the password here.
  const user = mockUsers.find(u => u.email === values.email);
  if (!user) {
    throw new Error("Kombinasi email dan kata sandi salah.");
  }

  // Set session cookie
  cookies().set(SESSION_COOKIE_NAME, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
  
  // Set the default role to switch to. Admin defaults to admin, Petugas defaults to petugas.
  const defaultRole = user.role === 'Admin Desa' ? 'admin' : 'petugas';
  cookies().set(ROLE_COOKIE_NAME, defaultRole, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
  });
}

export async function signOut() {
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(ROLE_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<Omit<User, 'password_hash'> | null> {
    const sessionUserId = cookies().get(SESSION_COOKIE_NAME)?.value;
    const activeRole = headers().get('x-active-role') || cookies().get(ROLE_COOKIE_NAME)?.value;
    
    // Fallback for demo mode (no one logged in)
    if (!sessionUserId) {
        const mockUser = mockUsers.find(u => u.role === 'Admin Desa');
        return mockUser || null;
    }

    const originalUser = mockUsers.find(u => u.id === sessionUserId);
     if (!originalUser) {
        return null; 
    }
    
    // If the user wants to simulate a petugas
    if (originalUser.role === 'Admin Desa' && activeRole === 'petugas') {
      // Find the first Petugas user to act as the mock.
      const mockPetugas = mockUsers.find(u => u.role === 'Petugas RT/RW');
      // Return mock Petugas, but ensure we keep the original admin's ID for context if needed
      // while maintaining the 'Petugas RT/RW' role for UI purposes.
      if (mockPetugas) {
         return {
            ...mockPetugas, // Has role 'Petugas RT/RW', name, etc.
            id: originalUser.id, // IMPORTANT: Keep the original admin ID to know who is simulating
            role: 'Petugas RT/RW' // Explicitly set role for clarity
        };
      }
    }

    // If no simulation is active, or the user is not an Admin, return their original data.
    return originalUser;
}

// --- USER ACTIONS ---

async function createUserAction(values: z.infer<typeof signupSchema | typeof signupPetugasSchema>, role: "Admin Desa" | "Petugas RT/RW", rtRw?: string) {
    console.log("Mock user creation:", values.name, role);
    return;
}

export async function createUser(values: z.infer<typeof signupSchema>) {
    await createUserAction(values, "Admin Desa");
}

export async function createPetugasUser(values: z.infer<typeof signupPetugasSchema>) {
    await createUserAction(values, "Petugas RT/RW", values.rtRw);
}

export async function addNewUser(values: z.infer<typeof userFormSchema>) {
    console.log("Mock add new user:", values.name);
    revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, values: z.infer<typeof editUserFormSchema>) {
    console.log("Mock update user:", id);
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
}

export async function deleteUser(userId: string) {
    console.log("Mock delete user:", userId);
    revalidatePath("/dashboard/users");
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    console.log("Mock update profile for:", userId);
    revalidatePath('/dashboard/settings');
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
   console.log("Mock update password for:", userId);
}


// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  console.log("Mock create UMKM:", values.businessName);
  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(id: string, values: z.infer<typeof umkmSchema>) {
  console.log("Mock update UMKM:", id);
  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}


export async function deleteUmkm(id: string) {
    console.log("Mock delete UMKM:", id);
    revalidatePath("/dashboard/umkm");
}

export async function deactivateUmkm(id: string) {
    console.log("Mock deactivate UMKM:", id);
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

export async function getUmkmData(forceAll = false): Promise<UMKM[]> {
  const user = await getCurrentUser();
  if (user?.role === 'Petugas RT/RW' && !forceAll) {
    return mockUmkm.filter(umkm => umkm.rtRw === user.rtRw);
  }
  // Admin sees all
  return mockUmkm;
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    return mockUsers;
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    const umkm = mockUmkm.find(u => u.id === id) || null;
    return umkm;
}

export async function getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    // If the ID is the admin's ID, but they are simulating a petugas, we might want to return the simulated profile
    // For now, returning the actual user profile is simpler.
    const user = mockUsers.find(u => u.id === id);
    if (user) return user;

    // It's possible the ID belongs to an admin who is simulating a role.
    // In that case, we should find the admin user.
    const adminUser = mockUsers.find(u => u.role === "Admin Desa");
    if (adminUser?.id === id) return adminUser;
    
    return null;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  return mockUmkm.filter(umkm => umkm.rtRw === rtRw);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}

export async function getManagementData(): Promise<Management[]> {
    return mockManagement;
}
