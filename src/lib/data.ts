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
    id: "user-admin",
    name: "Admin Desa",
    email: "admin@desa.com",
    role: "Admin Desa",
    rtRw: "-",
    avatarUrl: "https://placehold.co/100x100.png?text=AD",
  },
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
    id: "user-3",
    name: "Candra Wijaya",
    email: "candra.w@example.com",
    role: "Petugas RT/RW",
    rtRw: "003/001",
    avatarUrl: "https://placehold.co/100x100.png?text=CW",
  },
   {
    id: "user-4",
    name: "Fitri Handayani",
    email: "fitri.h@example.com",
    role: "Petugas RT/RW",
    rtRw: "001/002",
    avatarUrl: "https://placehold.co/100x100.png?text=FH",
  },
   {
    id: "user-5",
    name: "Gilang Permana",
    email: "gilang.p@example.com",
    role: "Petugas RT/RW",
    rtRw: "002/002",
    avatarUrl: "https://placehold.co/100x100.png?text=GP",
  },
];


const generateMockUmkmData = (): UMKM[] => {
  const umkmData: UMKM[] = [];
  const businessTypes: UMKM['businessType'][] = ["Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian"];
  const statuses: UMKM['status'][] = ["aktif", "tidak aktif"];
  const legalities: UMKM['legality'][] = ["Lengkap", "Tidak Lengkap", "Sedang Diproses"];
  
  const ownerFirstNames = ["Adi", "Budi", "Cici", "Dedi", "Eka", "Fani", "Gita", "Hadi", "Indah", "Joko"];
  const ownerLastNames = ["Nugroho", "Susanto", "Lestari", "Wijaya", "Permata", "Santoso", "Wati", "Pratama"];
  
  const businessKuliner = ["Warung", "Kedai", "Bakso", "Sate", "Nasi Goreng", "Ayam Bakar", "Es Teh", "Jus Buah"];
  const businessFashion = ["Butik", "Distro", "Jahit", "Pakaian Anak", "Hijab Store", "Sepatu"];
  const businessKerajinan = ["Rotan", "Kayu Jati", "Batik Tulis", "Gerabah", "Souvenir Unik"];
  const businessJasa = ["Bengkel", "Laundry", "Pangkas Rambut", "Servis AC", "Fotokopi", "Rental PS"];
  const businessPertanian = ["Tani Makmur", "Kelompok Tani", "Hidroponik", "Pupuk Organik", "Bibit Unggul"];

  const streetNames = ["Merdeka", "Pahlawan", "Sejahtera", "Damai", "Industri", "Pendidikan", "Sudirman", "Gajah Mada"];

  let umkmId = 1;

  for (let rw = 1; rw <= 26; rw++) {
    const totalRtInRw = Math.floor(Math.random() * 5) + 3; // 3 to 7 RTs
    for (let rt = 1; rt <= totalRtInRw; rt++) {
      const totalUmkmInRt = Math.floor(Math.random() * 3) + 1; // 1 to 3 UMKM
      for (let i = 0; i < totalUmkmInRt; i++) {
        
        const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
        let businessName = "";
        switch (businessType) {
            case "Kuliner": businessName = `${businessKuliner[Math.floor(Math.random() * businessKuliner.length)]} Barokah`; break;
            case "Fashion": businessName = `${businessFashion[Math.floor(Math.random() * businessFashion.length)]} Collection`; break;
            case "Kerajinan": businessName = `Griya ${businessKerajinan[Math.floor(Math.random() * businessKerajinan.length)]}`; break;
            case "Jasa": businessName = `${businessJasa[Math.floor(Math.random() * businessJasa.length)]} Jaya`; break;
            case "Pertanian": businessName = `Sumber ${businessPertanian[Math.floor(Math.random() * businessPertanian.length)]}`; break;
        }

        const ownerName = `${ownerFirstNames[Math.floor(Math.random() * ownerFirstNames.length)]} ${ownerLastNames[Math.floor(Math.random() * ownerLastNames.length)]}`;
        
        const startYear = 2018 + Math.floor(Math.random() * 6); // 2018-2023
        const startMonth = Math.floor(Math.random() * 12) + 1;
        const startDay = Math.floor(Math.random() * 28) + 1;
        const startDate = new Date(startYear, startMonth - 1, startDay);
        
        const umkm: UMKM = {
          id: `umkm-${umkmId}`,
          businessName: businessName,
          ownerName: ownerName,
          businessType: businessType,
          address: `Jl. ${streetNames[Math.floor(Math.random() * streetNames.length)]} No. ${umkmId}`,
          rtRw: `${String(rt).padStart(3, '0')}/${String(rw).padStart(3, '0')}`,
          contact: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          legality: legalities[Math.floor(Math.random() * legalities.length)],
          startDate: startDate.toISOString().split('T')[0],
          endDate: new Date(startDate.getFullYear() + 5, startDate.getMonth(), startDate.getDate()).toISOString().split('T')[0],
          employeeCount: Math.floor(Math.random() * 10) + 1,
          description: `Deskripsi singkat untuk ${businessName} yang dimiliki oleh ${ownerName}. Berlokasi di wilayah RT ${rt}/RW ${rw}.`,
          imageUrl: "https://placehold.co/600x400.png",
          createdAt: new Date().toISOString(),
          nib: `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`
        };
        
        umkmData.push(umkm);
        umkmId++;
      }
    }
  }
  return umkmData;
}

export const mockUmkm: UMKM[] = generateMockUmkmData();
