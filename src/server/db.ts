// In a real application, this would connect to a database.
// For this mock application, it will hold our "database" of users.

import type { User } from "@/lib/types";

// This simulates a user table in a database.
export let mockUsers: User[] = [
    {
        id: "user-1",
        name: "Admin Desa",
        email: "admin@desa.com",
        password_hash: '$2a$10$8UpR7g6JkTvsA6Vugm341u.3JtG1zUnzC3QdO3pIZ2z2f5t7B/0Pa', // Hashed "password123"
        role: "Admin Desa",
        rtRw: "-",
        avatarUrl: "https://placehold.co/100x100.png?text=A",
    },
    {
        id: "user-2",
        name: "Budi Santoso",
        email: "budi@desa.com",
        password_hash: '$2a$10$8UpR7g6JkTvsA6Vugm341u.3JtG1zUnzC3QdO3pIZ2z2f5t7B/0Pa', // Hashed "password123"
        role: "Petugas RT/RW",
        rtRw: "001/001",
        avatarUrl: "https://placehold.co/100x100.png?text=B",
    },
    {
        id: "user-3",
        name: "Citra Lestari",
        email: "citra@desa.com",
        password_hash: '$2a$10$8UpR7g6JkTvsA6Vugm341u.3JtG1zUnzC3QdO3pIZ2z2f5t7B/0Pa', // Hashed "password123"
        role: "Petugas RT/RW",
        rtRw: "001/002",
        avatarUrl: "https://placehold.co/100x100.png?text=C",
    },
    {
        id: "user-4",
        name: "Dedi Kurniawan",
        email: "dedi@desa.com",
        password_hash: '$2a$10$8UpR7g6JkTvsA6Vugm341u.3JtG1zUnzC3QdO3pIZ2z2f5t7B/0Pa', // Hashed "password123"
        role: "Petugas RT/RW",
        rtRw: "002/001",
        avatarUrl: "https://placehold.co/100x100.png?text=D",
    },
    {
        id: "user-5",
        name: "Eka Wulandari",
        email: "eka@desa.com",
        password_hash: '$2a$10$8UpR7g6JkTvsA6Vugm341u.3JtG1zUnzC3QdO3pIZ2z2f5t7B/0Pa', // Hashed "password123"
        role: "Petugas RT/RW",
        rtRw: "003/001",
        avatarUrl: "https://placehold.co/100x100.png?text=E",
    }
];
