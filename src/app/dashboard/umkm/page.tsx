import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UmkmTable } from "@/components/dashboard/umkm-table";
import { mockUmkm } from "@/lib/data";
import type { UMKM } from "@/lib/types";

export default function UmkmPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    type?: string;
    status?: string;
  };
}) {
  const query = searchParams?.q || "";
  const typeFilter = searchParams?.type || "all";
  const statusFilter = searchParams?.status || "all";

  const filteredUmkm: UMKM[] = mockUmkm.filter((umkm) => {
    const matchesQuery =
      umkm.businessName.toLowerCase().includes(query.toLowerCase()) ||
      umkm.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      umkm.rtRw.includes(query);
    const matchesType = typeFilter === "all" || umkm.businessType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || umkm.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Data UMKM</h1>
          <p className="text-muted-foreground mt-1">
            Kelola, cari, dan filter data UMKM di Desa Anda.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/umkm/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah UMKM
          </Link>
        </Button>
      </div>

      <UmkmTable data={filteredUmkm} />
    </div>
  );
}
