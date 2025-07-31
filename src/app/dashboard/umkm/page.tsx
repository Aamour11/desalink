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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Data UMKM</h1>
          <p className="text-muted-foreground">
            Kelola, cari, dan filter data UMKM di Desa X.
          </p>
        </div>
        <Button asChild>
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
