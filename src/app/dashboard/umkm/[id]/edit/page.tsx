import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUmkmById, getCurrentUser } from "@/server/actions";
import { notFound, redirect } from "next/navigation";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditUmkmPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [umkm, currentUser] = await Promise.all([
    getUmkmById(id),
    getCurrentUser()
  ]);

  if (!umkm) {
    notFound();
  }
  
  // Rule: Only Petugas RT/RW can edit, and only for their own region.
  const canEdit = currentUser?.role === 'Petugas RT/RW' && currentUser.rtRw === umkm.rtRw;

  if (!canEdit) {
    return (
       <div className="max-w-3xl mx-auto">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-max mb-4">
                    <Ban className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="font-headline text-2xl">Akses Ditolak</CardTitle>
                <CardDescription>
                    Anda tidak memiliki izin untuk mengedit data UMKM ini. Hanya petugas RT/RW yang bersangkutan yang dapat melakukannya.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/dashboard/umkm">Kembali ke Daftar UMKM</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Edit Data UMKM</CardTitle>
          <CardDescription>
            Perbarui informasi untuk {umkm.businessName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UmkmForm defaultValues={umkm} />
        </CardContent>
      </Card>
    </div>
  );
}
