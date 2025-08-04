import type { Announcement, Management, UMKM, User } from "@/lib/types";

// This file now only contains mock data for Announcements
// as user and UMKM data are now fetched from the database.

export const mockAnnouncements: Announcement[] = [
    {
        id: "ann-1",
        message: "Selamat datang di sistem informasi DesaLink UMKM! Mohon kepada semua petugas RT/RW untuk segera melengkapi dan memverifikasi data UMKM di wilayah masing-masing. Terima kasih.",
        createdAt: new Date().toISOString()
    }
];

export const mockManagement: Management[] = [
  {
    id: 1,
    name: "Budi Santoso",
    position: "Ketua RW 01",
    phone: "0812-3456-7890",
    email: "budi.s@example.com",
    avatarUrl: "https://placehold.co/100x100.png?text=BS",
    aiHint: "man official"
  },
  {
    id: 2,
    name: "Siti Aminah",
    position: "Ketua RW 02",
    phone: "0823-4567-8901",
    email: "siti.a@example.com",
    avatarUrl: "https://placehold.co/100x100.png?text=SA",
    aiHint: "woman official"
  },
  {
    id: 3,
    name: "Agus Wijaya",
    position: "Ketua RW 03",
    phone: "0834-5678-9012",
    email: "agus.w@example.com",
    avatarUrl: "https://placehold.co/100x100.png?text=AW",
    aiHint: "man official"
  },
];

export const mockUsers: Omit<User, "password_hash">[] = [
  {
    id: "user-1",
    name: "Ahmad Fauzi",
    email: "ahmad.f@example.com",
    role: "Petugas RT/RW",
    rtRw: "001/001",
    avatarUrl: "https://placehold.co/100x100.png?text=AF",
  },
  {
    id: "user-2",
    name: "Dewi Lestari",
    email: "dewi.l@example.com",
    role: "Petugas RT/RW",
    rtRw: "002/001",
    avatarUrl: "https://placehold.co/100x100.png?text=DL",
  },
  {
    id: "user-admin",
    name: "Admin Desa",
    email: "admin@desa.com",
    role: "Admin Desa",
    rtRw: "-",
    avatarUrl: "https://placehold.co/100x100.png?text=AD",
  }
];


export const mockUmkm: UMKM[] = [
    {
      id: "umkm-1",
      businessName: "Warung Kopi Senja",
      ownerName: "Bambang G.",
      businessType: "Kuliner",
      address: "Jl. Merdeka No. 1",
      rtRw: "001/001",
      contact: "08123456789",
      status: "aktif",
      legality: "Lengkap",
      startDate: "2022-01-15",
      endDate: "2025-01-14",
      employeeCount: 3,
      description: "Warung kopi sederhana dengan biji kopi pilihan dari seluruh nusantara.",
      imageUrl: "https://placehold.co/600x400.png",
      legalityDocumentUrl: "/path/to/doc.pdf",
      createdAt: new Date().toISOString(),
      nib: '1234567890123'
    },
    {
      id: "umkm-2",
      businessName: "Jahit & Fashion",
      ownerName: "Rina S.",
      businessType: "Fashion",
      address: "Jl. Pahlawan No. 2",
      rtRw: "002/001",
      contact: "08234567890",
      status: "aktif",
      legality: "Sedang Diproses",
      startDate: "2021-08-20",
      endDate: "2024-08-19",
      employeeCount: 5,
      description: "Menerima jahitan pakaian pria dan wanita, serta menjual baju jadi.",
      imageUrl: "https://placehold.co/600x400.png",
      createdAt: new Date().toISOString(),
      nib: '2345678901234'
    },
    {
      id: "umkm-3",
      businessName: "Kerajinan Rotan",
      ownerName: "Eko Prasetyo",
      businessType: "Kerajinan",
      address: "Gg. Damai No. 3",
      rtRw: "001/001",
      contact: "08345678901",
      status: "tidak aktif",
      legality: "Tidak Lengkap",
      startDate: "2020-03-10",
      employeeCount: 2,
      description: "Membuat berbagai macam kerajinan tangan dari bahan dasar rotan alami.",
      imageUrl: "https://placehold.co/600x400.png",
      createdAt: new Date().toISOString(),
      nib: '3456789012345'
    }
];
