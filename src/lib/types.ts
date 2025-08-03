export type UMKM = {
  id: string;
  businessName: string;
  ownerName: string;
  nib: string;
  businessType: "Kuliner" | "Fashion" | "Kerajinan" | "Jasa" | "Pertanian";
  address: string;
  rtRw: string;
  contact: string;
  status: "aktif" | "tidak aktif";
  legality: "Lengkap" | "Tidak Lengkap" | "Sedang Diproses";
  startDate: string;
  employeeCount: number;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin Desa" | "Petugas RT/RW";
  rtRw: string;
  avatarUrl: string;
  password_hash: string;
};
