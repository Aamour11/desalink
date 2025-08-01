import { UserForm } from "@/components/dashboard/user-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserById } from "@/server/actions";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  // Password tidak dikirim ke client, jadi kita tidak menampilkannya di form
  const userForForm = { ...user, password: "" };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Edit Pengguna</CardTitle>
          <CardDescription>
            Perbarui informasi untuk pengguna {user.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm defaultValues={userForForm} />
        </CardContent>
      </Card>
    </div>
  );
}
