
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UmkmTable } from "@/components/dashboard/umkm-table";
import { getUmkmData, getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";

export default async function UmkmPage() {
  // Fetch the current user, which could be the original user or the simulated one.
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    // If for any reason no user can be determined, redirect to login.
    return redirect("/login");
  }

  // The umkm data will be correctly filtered on the server based on the currentUser's role.
  const allUmkm = await getUmkmData();

  // The button visibility is now determined by the role of the (potentially simulated) user.
  // If the user is an Admin simulating a Petugas, `currentUser.role` will be 'Petugas RT/RW'.
  const canAddUmkm = currentUser.role === 'Petugas RT/RW';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Data UMKM</h1>
          <p className="text-muted-foreground mt-1">
            {canAddUmkm 
              ? `Kelola data UMKM untuk wilayah ${currentUser.rtRw}.`
              : "Kelola, cari, dan filter data UMKM di Desa Anda."
            }
          </p>
        </div>
        
        <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/umkm/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah UMKM
            </Link>
        </Button>
       
      </div>

      <UmkmTable data={allUmkm} currentUser={currentUser} />
    </div>
  );
}
