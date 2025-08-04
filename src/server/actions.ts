
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { executeQuery } from "@/lib/db";

import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import type { UMKM, User, Announcement, Management } from "@/lib/types";
import { mockAnnouncements, mockManagement } from "@/lib/data";

const SESSION_COOKIE_NAME = "session_id";

// --- AUTH ACTIONS ---

export async function signIn(values: z.infer<typeof loginSchema>) {
  // Mock success without db
  console.log("Mock sign in for:", values.email);
  cookies().set(SESSION_COOKIE_NAME, "mock-session-id", {
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
  // Return null to activate the mock user bypass in the layout
  return null;
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
    return;
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

export async function getUmkmData(): Promise<UMKM[]> {
  // Return empty array to avoid db calls
  return [];
}

export async function getUsersData(): Promise<Omit<User, 'password_hash'>[]> {
    // Return empty array to avoid db calls
    return [];
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    // Return null to avoid db calls
    return null;
}

export async function getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    // Return null to avoid db calls
    return null;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  // Return empty array to avoid db calls
  return [];
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    if (mockAnnouncements.length === 0) return null;
    return mockAnnouncements[0];
}

export async function getManagementData(): Promise<Management[]> {
    // Return mock data to avoid db calls
    return mockManagement;
}
