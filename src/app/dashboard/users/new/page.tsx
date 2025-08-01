import { UserForm } from "@/components/dashboard/user-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewUserPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tambah Pengguna Baru</CardTitle>
          <CardDescription>
            Isi formulir untuk membuat akun baru. Kata sandi akan dikirim via email (simulasi).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}