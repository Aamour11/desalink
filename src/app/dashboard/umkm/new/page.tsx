import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewUmkmPage() {
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
          <UmkmForm />
        </CardContent>
      </Card>
    </div>
  );
}
