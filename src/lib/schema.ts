
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
  legality: z.enum(["Lengkap", "Tidak Lengkap", "Sedang Diproses"], {
    required_error: "Status legalitas harus dipilih.",
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  employeeCount: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  legalityDocumentUrl: z.string().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
});

export const signupPetugasSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
  rtRw: z.string().regex(/^\d{3}\/\d{3}$/, "Format RT/RW harus 001/001."),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Kata sandi tidak boleh kosong." }),
});

// Base schema for user data
const baseUserSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  role: z.enum(["Admin Desa", "Petugas RT/RW"]),
  rtRw: z.string().optional(),
});

// Refinement logic to be applied to both schemas
const userRefinement = (data: z.infer<typeof baseUserSchema>) => {
    if (data.role === 'Petugas RT/RW') {
        return !!data.rtRw && /^\d{3}\/\d{3}$/.test(data.rtRw);
    }
    // For Admin Desa, rtRw can be optional or '-'
    return true;
};
const refinementOptions = {
    message: "Format RT/RW harus 001/001 untuk Petugas RT/RW.",
    path: ["rtRw"],
};

// Schema for creating a new user, requires a password
export const userFormSchema = baseUserSchema.extend({
     password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
}).refine(userRefinement, refinementOptions);


// Schema for editing an existing user, password is optional
export const editUserFormSchema = baseUserSchema.extend({
    password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }).optional().or(z.literal('')),
}).refine(userRefinement, refinementOptions);

// Schema for updating user profile from settings page
export const updateProfileSchema = z.object({
    name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
});

// Schema for updating password from settings page
export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Kata sandi saat ini harus diisi." }),
    newPassword: z.string().min(6, { message: "Kata sandi baru minimal 6 karakter." }),
    confirmPassword: z.string().min(6, { message: "Konfirmasi kata sandi minimal 6 karakter." })
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Kata sandi baru dan konfirmasi tidak cocok.",
    path: ["confirmPassword"],
});
