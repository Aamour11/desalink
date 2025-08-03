
'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { umkmSchema, signupSchema, loginSchema, userFormSchema, editUserFormSchema, updateProfileSchema, updatePasswordSchema, signupPetugasSchema } from "@/lib/schema";
import { mockUsers, mockUmkm, mockAnnouncements } from "@/lib/data";
import type { UMKM, User, Announcement } from "@/lib/types";
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

  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw new Error("Email atau kata sandi salah.");
  }
  
  const passwordsMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordsMatch) {
    throw new Error("Email atau kata sandi salah.");
  }

  const tokenPayload = {
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role,
    rtRw: user.rtRw,
    avatarUrl: user.avatarUrl,
  };
  
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const cookieStore = cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: true };
}

export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    // We need to return the full user object including password hash for other functions to work
    const userFromDb = mockUsers.find(u => u.id === decoded.id);
    return userFromDb || null;
  } catch (error) {
    // Token is invalid or expired
    return null;
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

  if (mockUsers.find(u => u.email === email)) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
  }
  
  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    name,
    email,
    password_hash: hashedPassword,
    role: "Admin Desa",
    rtRw: "-",
    avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`
  };

  mockUsers.push(newUser);
}

export async function createPetugasUser(values: z.infer<typeof signupPetugasSchema>) {
  const validatedFields = signupPetugasSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }

  const { name, email, password, rtRw } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (mockUsers.find(u => u.email === email)) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
  }
  
  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    name,
    email,
    password_hash: hashedPassword,
    role: "Petugas RT/RW",
    rtRw: rtRw,
    avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`
  };

  mockUsers.push(newUser);
}


export async function addNewUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name, email, password, role, rtRw } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (mockUsers.find(u => u.email === email)) {
        throw new Error("Email sudah terdaftar untuk pengguna lain.");
    }
    
    const newUser: User = {
        id: `user-${mockUsers.length + 1}`,
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

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name, role, rtRw, password } = validatedFields.data;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
        throw new Error("Pengguna tidak ditemukan.");
    }

    const updatedUser = { ...mockUsers[userIndex], name, role, rtRw: role === 'Admin Desa' ? '-' : rtRw || '' };

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedUser.password_hash = hashedPassword;
    }
    
    mockUsers[userIndex] = updatedUser;

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    revalidatePath(`/dashboard/users/${id}/edit`);
}

export async function deleteUser(userId: string) {
    if (userId === 'user-1') {
      throw new Error('Admin utama tidak dapat dihapus.');
    }
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
        mockUsers.splice(index, 1);
        revalidatePath("/dashboard/users");
        return { success: true };
    }
    throw new Error('Gagal menghapus pengguna.');
}

export async function updateProfile(userId: string, values: z.infer<typeof updateProfileSchema>) {
    const validatedFields = updateProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }

    const { name } = validatedFields.data;
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        throw new Error('Pengguna tidak ditemukan.');
    }

    mockUsers[userIndex].name = name;
    revalidatePath('/dashboard/settings');
}

export async function updatePassword(userId: string, values: z.infer<typeof updatePasswordSchema>) {
    const validatedFields = updatePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error("Data tidak valid.");
    }
    
    const { currentPassword, newPassword } = validatedFields.data;
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        throw new Error("Pengguna tidak ditemukan.");
    }
    const user = mockUsers[userIndex];

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordsMatch) {
        throw new Error("Kata sandi saat ini salah.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedNewPassword;
}

// --- UMKM ACTIONS ---

export async function createUmkm(values: z.infer<typeof umkmSchema>) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "Petugas RT/RW") {
    throw new Error("Hanya Petugas RT/RW yang dapat menambah data UMKM.");
  }

  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }
  
  if (validatedFields.data.rtRw !== currentUser.rtRw) {
      throw new Error("Anda hanya dapat menambah data untuk wilayah Anda sendiri.");
  }

  const newUmkm: UMKM = {
    id: `umkm-${mockUmkm.length + 1}`,
    createdAt: new Date().toISOString(),
    ...validatedFields.data,
    employeeCount: validatedFields.data.employeeCount || 0,
    imageUrl: validatedFields.data.imageUrl || 'https://placehold.co/600x400.png'
  };

  mockUmkm.unshift(newUmkm);
  revalidatePath("/dashboard/umkm");
}

export async function updateUmkm(
  id: string,
  values: z.infer<typeof umkmSchema>,
  oldImageUrl?: string | null
) {
  const currentUser = await getCurrentUser();
  const umkmToUpdate = mockUmkm.find(u => u.id === id);

  if (!umkmToUpdate) {
    throw new Error("UMKM tidak ditemukan.");
  }

  if (currentUser?.role === 'Petugas RT/RW' && currentUser.rtRw !== umkmToUpdate.rtRw) {
      throw new Error("Anda tidak memiliki izin untuk mengedit UMKM ini.");
  }

  if (currentUser?.role === 'Admin Desa') {
       throw new Error("Admin tidak dapat mengedit data UMKM.");
  }

  const validatedFields = umkmSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Data tidak valid.");
  }

  const umkmIndex = mockUmkm.findIndex(u => u.id === id);
  if (umkmIndex === -1) {
    throw new Error("UMKM tidak ditemukan.");
  }
  
  const { imageUrl, legalityDocumentUrl } = validatedFields.data;
  const oldUmkmData = mockUmkm[umkmIndex];

  // Logic to delete old image if a new one is uploaded
  if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
    if (!oldImageUrl.includes("placehold.co")) {
      try {
        const oldImagePath = join(process.cwd(), "public", oldImageUrl);
        await stat(oldImagePath);
        await unlink(oldImagePath);
        console.log(`Successfully deleted old image: ${oldImagePath}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.log(`Old image not found, skipping deletion: ${oldImageUrl}`);
        } else {
          console.error("Error deleting old image:", error);
        }
      }
    }
  }

  if (oldUmkmData.legalityDocumentUrl && legalityDocumentUrl && oldUmkmData.legalityDocumentUrl !== legalityDocumentUrl) {
    if (!oldUmkmData.legalityDocumentUrl.includes("placehold.co")) {
      try {
        const oldDocPath = join(process.cwd(), "public", oldUmkmData.legalityDocumentUrl);
        await stat(oldDocPath);
        await unlink(oldDocPath);
        console.log(`Successfully deleted old document: ${oldDocPath}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.log(`Old document not found, skipping deletion: ${oldUmkmData.legalityDocumentUrl}`);
        } else {
          console.error("Error deleting old document:", error);
        }
      }
    }
  }

  mockUmkm[umkmIndex] = {
    ...mockUmkm[umkmIndex],
    ...validatedFields.data,
    employeeCount: validatedFields.data.employeeCount || 0,
    imageUrl: imageUrl || 'https://placehold.co/600x400.png'
  };

  revalidatePath(`/dashboard/umkm`);
  revalidatePath(`/dashboard/umkm/${id}/edit`);
}

export async function deleteUmkm(id: string) {
    const currentUser = await getCurrentUser();
    const umkmIndex = mockUmkm.findIndex(u => u.id === id);
    if (umkmIndex === -1) {
      throw new Error("UMKM tidak ditemukan.");
    }
    const umkmData = mockUmkm[umkmIndex];

    if (currentUser?.role === 'Petugas RT/RW' && currentUser.rtRw !== umkmData.rtRw) {
        throw new Error("Anda tidak memiliki izin untuk menghapus UMKM ini.");
    }
     if (currentUser?.role === 'Admin Desa') {
       throw new Error("Admin tidak dapat menghapus data UMKM.");
    }


    mockUmkm.splice(umkmIndex, 1);

    // Delete image file
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
    // Delete document file
    if (umkmData?.legalityDocumentUrl && !umkmData.legalityDocumentUrl.includes("placehold.co")) {
         try {
            const docPath = join(process.cwd(), "public", umkmData.legalityDocumentUrl);
            await stat(docPath);
            await unlink(docPath);
            console.log(`Successfully deleted document for UMKM ID ${id}: ${docPath}`);
        } catch (error: any) {
             if (error.code === 'ENOENT') {
                console.log(`Document not found, skipping deletion: ${umkmData.legalityDocumentUrl}`);
            } else {
                console.error("Error deleting document file:", error);
            }
        }
    }
    
    revalidatePath("/dashboard/umkm");
    return { success: true };
}

export async function deactivateUmkm(id: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin Desa') {
        throw new Error("Hanya Admin Desa yang dapat menonaktifkan UMKM.");
    }

    const umkmIndex = mockUmkm.findIndex(u => u.id === id);
    if (umkmIndex === -1) {
        throw new Error("UMKM tidak ditemukan.");
    }

    mockUmkm[umkmIndex].status = "tidak aktif";

    revalidatePath("/dashboard/umkm");
    revalidatePath(`/dashboard/structure`);
    return { success: true };
}


// --- ANNOUNCEMENT ACTIONS ---

export async function sendAnnouncement(message: string) {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin Desa') {
        throw new Error("Hanya Admin Desa yang dapat mengirim pengumuman.");
    }

    if (!message || message.trim().length === 0) {
        throw new Error("Pesan tidak boleh kosong.");
    }

    const newAnnouncement: Announcement = {
        id: `ann-${mockAnnouncements.length + 1}`,
        message: message.trim(),
        createdAt: new Date().toISOString(),
    };

    // Replace old announcement with the new one
    mockAnnouncements[0] = newAnnouncement;

    revalidatePath("/dashboard");
    return { success: true };
}


// --- DATA FETCHING ---
export async function getUmkmData(): Promise<UMKM[]> {
    const user = await getCurrentUser();
    
    if (user?.role === 'Petugas RT/RW' && user.rtRw) {
        return mockUmkm.filter(u => u.rtRw === user.rtRw);
    }
    
    // Sort by most recently created
    return [...mockUmkm].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUsersData(): Promise<User[]> {
    const user = await getCurrentUser();
    if (user?.role !== 'Admin Desa') {
        return [];
    }
    return [...mockUsers];
}

export async function getUmkmById(id: string): Promise<UMKM | null> {
    return mockUmkm.find(u => u.id === id) || null;
}


export async function getUserById(id: string): Promise<User | null> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;
    // Return a copy without the password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
}

export async function getUmkmManagedByUser(rtRw: string): Promise<UMKM[]> {
  if (!rtRw || rtRw === '-') return [];
  return mockUmkm.filter(u => u.rtRw === rtRw);
}

export async function getLatestAnnouncement(): Promise<Announcement | null> {
    if (mockAnnouncements.length === 0) {
        return null;
    }
    // Return the latest announcement
    return mockAnnouncements[0];
}
