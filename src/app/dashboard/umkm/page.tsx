
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UmkmTable } from "@/components/dashboard/umkm-table";
import { getUmkmData, getCurrentUser } from "@/server/actions";
import type { UMKM } from "@/lib/types";

export default async function UmkmPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    type?: string;
    status?: string;
    rw?: string;
    rt?: string;
  };
}) {
  const allUmkm = await getUmkmData();
  let currentUser = await getCurrentUser();

  if (!currentUser) {
    // This should ideally not happen if middleware is correct, but as a fallback:
    return <div>Loading...</div>; // Or redirect to login
  }

  // A user can add UMKM if they are a Petugas, or an Admin simulating a Petugas
  const canAddUmkm = currentUser?.role === 'Petugas RT/RW';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Data UMKM</h1>
          <p className="text-muted-foreground mt-1">
            Kelola, cari, dan filter data UMKM di Desa Anda.
          </p>
        </div>
        {canAddUmkm && (
            <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/umkm/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah UMKM
                </Link>
            </Button>
        )}
      </div>

      <UmkmTable data={allUmkm} currentUser={currentUser} />
    </div>
  );
}

    
