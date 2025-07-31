import { UmkmForm } from "@/components/dashboard/umkm-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockUmkm } from "@/lib/data";
import { notFound } from "next/navigation";

export default function EditUmkmPage({ params }: { params: { id: string } }) {
  const umkm = mockUmkm.find((u) => u.id === params.id);

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
