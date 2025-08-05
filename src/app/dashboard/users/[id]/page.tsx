
import { getUserById, getUmkmManagedByUser, getCurrentUser } from "@/server/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AtSign, MapPin, User as UserIcon, Briefcase, LayoutGrid } from "lucide-react";
import { UmkmTable } from "@/components/dashboard/umkm-table";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, currentUser] = await Promise.all([
      getUserById(params.id),
      getCurrentUser()
  ]);

  if (!user || !currentUser) {
    notFound();
  }

  // Only Admin can see the list of managed UMKM on a profile page
  const umkmManagedByUser = user.role === "Petugas RT/RW" ? await getUmkmManagedByUser(user.rtRw) : [];
  
  const canSimulate = currentUser.role === 'Admin Desa' && user.role === 'Petugas RT/RW';

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users">
                <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Profil Pengguna</h1>
            <p className="text-muted-foreground">Detail lengkap untuk pengguna {user.name}.</p>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={128}
                height={128}
                className="rounded-full mb-4 border-4 border-primary/20"
                data-ai-hint="user avatar"
              />
              <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
              <CardDescription>
                 <Badge variant={user.role === "Admin Desa" ? "default" : "secondary"}>
                    {user.role}
                 </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3 text-sm">
                  <AtSign className="h-5 w-5 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <span>ID: {user.id}</span>
                </div>
                {user.role === "Petugas RT/RW" && (
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span>Wilayah: {user.rtRw}</span>
                    </div>
                )}
                 {canSimulate && (
                    <div className="pt-4 border-t">
                        <Button asChild className="w-full">
                           <Link href={`/dashboard?sim_user=${user.id}`}>
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                Lihat Dasbor Petugas
                           </Link>
                        </Button>
                        <p className="text-xs text-center mt-2 text-muted-foreground">Simulasikan tampilan sebagai {user.name}.</p>
                    </div>
                 )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Briefcase className="h-6 w-6 text-primary" />
                        UMKM yang Dikelola
                    </CardTitle>
                    <CardDescription>
                        Daftar UMKM yang berada di wilayah cakupan {user.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {user.role === "Petugas RT/RW" ? (
                       umkmManagedByUser.length > 0 ? (
                         <UmkmTable data={umkmManagedByUser} currentUser={user} />
                       ): (
                         <p className="text-center text-muted-foreground py-8">
                            Belum ada data UMKM untuk wilayah ini.
                        </p>
                       )
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            Admin Desa memiliki akses ke semua data UMKM.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
