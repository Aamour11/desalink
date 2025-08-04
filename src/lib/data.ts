import type { Announcement, Management } from "@/lib/types";

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
