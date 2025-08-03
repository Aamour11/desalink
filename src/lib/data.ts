import type { UMKM, User } from "@/lib/types";
import bcrypt from "bcryptjs";

// Helper to create hashed passwords for mock users
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// We need an async IIFE to create users with hashed passwords
let mockUsers: User[] = [];

(async () => {
    mockUsers.push(
      {
        id: "user-1",
        name: "Admin Desa",
        email: "admin@desa.com",
        password_hash: await hashPassword("password123"),
        role: "Admin Desa",
        rtRw: "-",
        avatarUrl: "https://placehold.co/100x100.png?text=A",
      },
      {
        id: "user-2",
        name: "Budi Santoso",
        email: "budi@desa.com",
        password_hash: await hashPassword("password123"),
        role: "Petugas RT/RW",
        rtRw: "001/001",
        avatarUrl: "https://placehold.co/100x100.png?text=B",
      },
      {
        id: "user-3",
        name: "Citra Lestari",
        email: "citra@desa.com",
        password_hash: await hashPassword("password123"),
        role: "Petugas RT/RW",
        rtRw: "002/001",
        avatarUrl: "https://placehold.co/100x100.png?text=C",
      },
      {
        id: "user-4",
        name: "Dedi Kurniawan",
        email: "dedi@desa.com",
        password_hash: await hashPassword("password123"),
        role: "Petugas RT/RW",
        rtRw: "001/002",
        avatarUrl: "https://placehold.co/100x100.png?text=D",
      }
    );
})();


let mockUmkm: UMKM[] = [
  {
    id: "umkm-1",
    businessName: "Warung Makan Barokah",
    ownerName: "Ibu Siti",
    nib: "1234567890123",
    businessType: "Kuliner",
    address: "Jl. Mawar No. 1, Dusun Damai",
    rtRw: "001/001",
    contact: "081234567890",
    status: "aktif",
    legality: "Lengkap",
    startDate: "2020-05-10",
    employeeCount: 3,
    description: "Menjual aneka masakan rumahan lezat dan higienis.",
    imageUrl: "/uploads/placeholder-kuliner.png",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "umkm-2",
    businessName: "Fashionable Hijab",
    ownerName: "Rina Melati",
    nib: "2345678901234",
    businessType: "Fashion",
    address: "Jl. Kenanga No. 5, Dusun Sejahtera",
    rtRw: "002/001",
    contact: "082345678901",
    status: "aktif",
    legality: "Sedang Diproses",
    startDate: "2021-02-20",
    employeeCount: 5,
    description: "Menyediakan berbagai model hijab modern dan berkualitas.",
    imageUrl: "/uploads/placeholder-fashion.png",
     createdAt: "2024-01-16T11:00:00Z"
  },
  {
    id: "umkm-3",
    businessName: "Kerajinan Rotan Estetik",
    ownerName: "Bapak Joko",
    nib: "3456789012345",
    businessType: "Kerajinan",
    address: "Jl. Anggrek No. 12, Dusun Kreatif",
    rtRw: "003/001",
    contact: "083456789012",
    status: "tidak aktif",
    legality: "Tidak Lengkap",
    startDate: "2019-11-01",
    employeeCount: 10,
    description: "Produk kerajinan tangan dari rotan untuk dekorasi rumah.",
    imageUrl: "/uploads/placeholder-kerajinan.png",
     createdAt: "2024-01-17T12:00:00Z"
  },
  {
    id: "umkm-4",
    businessName: "Jasa Servis Elektronik Cepat",
    ownerName: "Agus Setiawan",
    nib: "4567890123456",
    businessType: "Jasa",
    address: "Jl. Melati No. 8, Dusun Maju",
    rtRw: "001/002",
    contact: "084567890123",
    status: "aktif",
    legality: "Lengkap",
    startDate: "2022-08-15",
    employeeCount: 2,
    description: "Melayani perbaikan TV, kulkas, mesin cuci, dan lainnya.",
    imageUrl: "/uploads/placeholder-jasa.png",
     createdAt: "2024-01-18T13:00:00Z"
  },
  {
    id: "umkm-5",
    businessName: "Sayur Organik Pak Tani",
    ownerName: "Bapak Sutrisno",
    nib: "5678901234567",
    businessType: "Pertanian",
    address: "Kavling Pertanian, Dusun Subur",
    rtRw: "004/001",
    contact: "085678901234",
    status: "aktif",
    legality: "Lengkap",
    startDate: "2023-01-30",
    employeeCount: 8,
    description: "Menjual sayuran segar langsung dari kebun tanpa pestisida.",
    imageUrl: "/uploads/placeholder-pertanian.png",
     createdAt: "2024-01-19T14:00:00Z"
  },
  {
    id: "umkm-6",
    businessName: "Toko Kelontong Sentosa",
    ownerName: "Haji Sulam",
    nib: "6789012345678",
    businessType: "Kuliner",
    address: "Jl. Damai No. 20",
    rtRw: "001/003",
    contact: "081122334455",
    status: "aktif",
    legality: "Lengkap",
    startDate: "2018-03-12",
    employeeCount: 2,
    description: "Menyediakan kebutuhan pokok sehari-hari.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-02-01T09:00:00Z"
  },
   {
    id: "umkm-7",
    businessName: "Bengkel Motor Jaya",
    ownerName: "Udin",
    nib: "7890123456789",
    businessType: "Jasa",
    address: "Jl. Raya Sejahtera No. 15",
    rtRw: "001/004",
    contact: "082233445566",
    status: "aktif",
    legality: "Tidak Lengkap",
    startDate: "2021-07-21",
    employeeCount: 4,
    description: "Servis dan suku cadang motor segala merek.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-02-02T10:00:00Z"
  },
  {
    id: "umkm-8",
    businessName: "Catering Ibu Hartini",
    ownerName: "Ibu Hartini",
    nib: "8901234567890",
    businessType: "Kuliner",
    address: "Gg. Kenari No. 3",
    rtRw: "001/005",
    contact: "083344556677",
    status: "aktif",
    legality: "Sedang Diproses",
    startDate: "2022-01-10",
    employeeCount: 7,
    description: "Menerima pesanan nasi kotak dan tumpeng untuk berbagai acara.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-02-03T11:00:00Z"
  },
  {
    id: "umkm-9",
    businessName: "Batik Tulis Asli",
    ownerName: "Dewi Lestari",
    nib: "9012345678901",
    businessType: "Fashion",
    address: "Jl. Wiradesa No. 5",
    rtRw: "002/002",
    contact: "084455667788",
    status: "tidak aktif",
    legality: "Lengkap",
    startDate: "2019-09-09",
    employeeCount: 15,
    description: "Koleksi batik tulis premium dengan motif khas daerah.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-02-04T12:00:00Z"
  },
  {
    id: "umkm-10",
    businessName: "Kebun Buah Naga Lestari",
    ownerName: "Pak Eko",
    nib: "0123456789012",
    businessType: "Pertanian",
    address: "Area Agrowisata",
    rtRw: "002/003",
    contact: "085566778899",
    status: "aktif",
    legality: "Lengkap",
    startDate: "2023-03-05",
    employeeCount: 6,
    description: "Wisata petik buah naga dan penjualan bibit unggul.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-02-05T13:00:00Z"
  },
  {
    id: "umkm-11",
    businessName: "Laundry Bersih Cemerlang",
    ownerName: "Anisa",
    nib: "",
    businessType: "Jasa",
    address: "Jl. Pancasila No. 30",
    rtRw: "002/004",
    contact: "081212121212",
    status: "aktif",
    legality: "Tidak Lengkap",
    startDate: "2023-10-01",
    employeeCount: 3,
    description: "Jasa cuci dan setrika pakaian, karpet, dan boneka.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-03-10T08:00:00Z"
  },
  {
    id: "umkm-12",
    businessName: "Ternak Lele Organik",
    ownerName: "Supardi",
    nib: "1122334455667",
    businessType: "Pertanian",
    address: "Belakang Balai Desa",
    rtRw: "002/005",
    contact: "085757575757",
    status: "aktif",
    legality: "Sedang Diproses",
    startDate: "2022-06-15",
    employeeCount: 4,
    description: "Budidaya dan penjualan lele segar organik.",
    imageUrl: "https://placehold.co/600x400.png",
    createdAt: "2024-03-11T09:00:00Z"
  }
];

export { mockUsers, mockUmkm };
