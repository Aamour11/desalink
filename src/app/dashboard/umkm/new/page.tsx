
import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";


export default async function NewUmkmPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect("/login");
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
