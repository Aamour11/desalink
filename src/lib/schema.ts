import { z } from "zod";

export const umkmSchema = z.object({
  businessName: z.string().min(3, "Nama usaha minimal 3 karakter."),
  ownerName: z.string().min(3, "Nama pemilik minimal 3 karakter."),
  nib: z.string().optional(),
  businessType: z.enum([
    "Kuliner",
    "Fashion",
    "Kerajinan",
    "Jasa",
    "Pertanian",
  ]),
  address: z.string().min(10, "Alamat minimal 10 karakter."),
  rtRw: z.string().regex(/^\d{3}\/\d{3}$/, "Format RT/RW harus 001/001."),
  contact: z.string().min(10, "Nomor kontak minimal 10 digit.").max(15),
  status: z.enum(["aktif", "tidak aktif"]),
  startDate: z.string().optional(),
  employeeCount: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Kata sandi tidak boleh kosong." }),
});

export const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
  role: z.enum(["Admin Desa", "Petugas RT/RW"]),
  rtRw: z.string().optional(),
}).refine(data => {
    if (data.role === 'Petugas RT/RW') {
        return /^\d{3}\/\d{3}$/.test(data.rtRw || "");
    }
    return true;
}, {
    message: "Format RT/RW harus 001/001 untuk Petugas RT/RW.",
    path: ["rtRw"],
});
