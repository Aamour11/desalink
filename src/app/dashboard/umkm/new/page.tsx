
import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/server/actions";

// Mock user for bypass
const mockUser = {
  id: 'user-bypass',
  name: 'Developer',
  email: 'dev@example.com',
  role: 'Admin Desa' as const,
  rtRw: '-',
  avatarUrl: 'https://placehold.co/100x100.png?text=D'
};


export default async function NewUmkmPage() {
  let currentUser = await getCurrentUser();
  if (!currentUser) {
    currentUser = mockUser;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tambah Data UMKM Baru</CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk mendaftarkan UMKM baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UmkmForm currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
