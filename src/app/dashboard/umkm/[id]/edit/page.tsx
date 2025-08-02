import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUmkmById } from "@/server/actions";
import { notFound } from "next/navigation";

export default async function EditUmkmPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const umkm = await getUmkmById(id);

  if (!umkm) {
    notFound();
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
