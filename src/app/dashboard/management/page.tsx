import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail } from "lucide-react";
import { getManagementData } from "@/server/actions";
  
export default async function ManagementPage() {
    const management = await getManagementData();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Struktur Kepengurusan
          </h1>
          <p className="text-muted-foreground">
            Daftar nama dan kontak pengurus RW di lingkungan desa.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {management.map((person) => (
            <Card key={person.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={person.avatarUrl} alt={person.name} data-ai-hint={person.aiHint} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{person.name}</CardTitle>
                  <CardDescription>{person.position}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{person.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                   <span>{person.email}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
         <div className="mt-8">
          <Card className="bg-secondary/50 border-primary/20">
            <CardHeader>
                <CardTitle>Catatan</CardTitle>
                <CardDescription>
                    Halaman ini menampilkan data pengurus yang diambil dari database. Untuk pembaruan atau perubahan data, silakan hubungi administrator sistem.
                </CardDescription>
            </CardHeader>
          </Card>
      </div>
      </div>
    );
}
