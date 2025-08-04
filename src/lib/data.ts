import type { Announcement } from "@/lib/types";

// This file now only contains mock data for Announcements
// as user and UMKM data are now fetched from the database.

export const mockAnnouncements: Announcement[] = [
    {
        id: "ann-1",
        message: "Selamat datang di sistem informasi DesaLink UMKM! Mohon kepada semua petugas RT/RW untuk segera melengkapi dan memverifikasi data UMKM di wilayah masing-masing. Terima kasih.",
        createdAt: new Date().toISOString()
    }
];
