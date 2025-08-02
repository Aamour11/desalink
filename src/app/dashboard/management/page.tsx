
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Phone, Mail } from "lucide-react";
  
  const management = [
    {
      name: "Bapak Widodo",
      position: "Ketua RW 01",
      phone: "0812-3456-7890",
      email: "widodo@example.com",
      avatar: "https://placehold.co/100x100.png?text=W",
      aiHint: "man portrait"
    },
    {
      name: "Bapak Susanto",
      position: "Ketua RW 02",
      phone: "0823-4567-8901",
      email: "susanto@example.com",
      avatar: "https://placehold.co/100x100.png?text=S",
      aiHint: "man portrait"
    },
    {
      name: "Ibu Hartini",
      position: "Ketua RW 03",
      phone: "0834-5678-9012",
      email: "hartini@example.com",
      avatar: "https://placehold.co/100x100.png?text=H",
      aiHint: "woman portrait"
    },
     {
      name: "Bapak Prabowo",
      position: "Ketua RW 04",
      phone: "0812-3456-7890",
      email: "prabowo@example.com",
      avatar: "https://placehold.co/100x100.png?text=P",
      aiHint: "man portrait"
    },
    {
      name: "Bapak Gibran",
      position: "Ketua RW 05",
      phone: "0823-4567-8901",
      email: "gibran@example.com",
      avatar: "https://placehold.co/100x100.png?text=G",
      aiHint: "man portrait"
    },
    {
      name: "Ibu Puan",
      position: "Ketua RW 06",
      phone: "0834-5678-9012",
      email: "puan@example.com",
      avatar: "https://placehold.co/100x100.png?text=P",
      aiHint: "woman portrait"
    },
  ];
  
  export default function ManagementPage() {
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
            <Card key={person.name}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={person.avatar} alt={person.name} data-ai-hint={person.aiHint} />
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
                    Halaman ini bersifat statis dan menampilkan data pengurus yang telah ditentukan. Untuk pembaruan atau perubahan data, silakan hubungi administrator sistem.
                </CardDescription>
            </CardHeader>
          </Card>
      </div>
      </div>
    );
  }
  