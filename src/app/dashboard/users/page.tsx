
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/dashboard/users-table";
import { getUsersData, getCurrentUser } from "@/server/actions";

// Mock user for bypass
const mockUser = {
  id: 'user-bypass',
  name: 'Developer',
  email: 'dev@example.com',
  role: 'Admin Desa' as const,
  rtRw: '-',
  avatarUrl: 'https://placehold.co/100x100.png?text=D'
};

export default async function UsersPage() {
  const users = await getUsersData();
  let currentUser = await getCurrentUser();

  if (!currentUser) {
    currentUser = mockUser;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola akun dan hak akses pengguna sistem.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      <UsersTable data={users} currentUser={currentUser} />
    </div>
  );
}
