
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies, headers } from 'next/headers';
import { executeQuery } from "@/lib/db";

import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement, Management } from "@/lib/types";
import { mockAnnouncements, mockManagement, mockUmkm, mockUsers } from "@/lib/data";

const SESSION_COOKIE_NAME = "session_id";

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

    const originalUser = mockUsers.find(u => u.id === sessionUserId);
    
    if (!originalUser) {
        // This case should ideally not happen if the session cookie is valid.
        // It's a safeguard.
        cookies().delete(SESSION_COOKIE_NAME);
        return null;
    }
    
    // Role simulation logic: only an Admin can simulate a Petugas.
    if (originalUser.role === 'Admin Desa' && simulationUserId) {
      const simulatedUser = mockUsers.find(u => u.id === simulationUserId && u.role === 'Petugas RT/RW');
      // If a valid Petugas user is found for simulation, return them.
      if (simulatedUser) {
         return simulatedUser;
      }
      // If the simulation user ID is invalid or not a Petugas, we fall through
      // and return the original Admin user, preventing a logout.
    }

    // If no simulation is active or if simulation is invalid, return the original user.
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
    const user = await getCurrentUser();
    if(user?.id === userId){
        throw new Error("Anda tidak dapat menghapus akun Anda sendiri.");
    }
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
  
  if (!user) return [];

  // If role is Petugas (either real or simulated), filter data by their rtRw.
  // The `forceAll` flag is used by pages like Structure to override this filtering for Admin.
  if (user.role === 'Petugas RT/RW' && !forceAll) {
    return mockUmkm.filter(umkm => umkm.rtRw === user.rtRw);
  }

  // Admin sees all data.
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
    const user = mockUsers.find(u => u.id === id);
    if (user) return user;
    
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
