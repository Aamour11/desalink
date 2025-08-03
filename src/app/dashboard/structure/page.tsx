
import { getUmkmData, getCurrentUser } from "@/server/actions";
import type { UMKM } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type UmkmByRw = {
  [rw: string]: {
    [rt: string]: UMKM[];
  };
};

export default async function StructurePage() {
  const currentUser = await getCurrentUser();
  const allUmkm = await getUmkmData();

  const umkmByRw: UmkmByRw = allUmkm.reduce((acc, umkm) => {
    const [rt, rw] = umkm.rtRw.split("/");
    if (!acc[rw]) {
      acc[rw] = {};
    }
    if (!acc[rw][rt]) {
      acc[rw][rt] = [];
    }
    acc[rw][rt].push(umkm);
    return acc;
  }, {} as UmkmByRw);

  const isPetugas = currentUser?.role === "Petugas RT/RW";
  const petugasRw = isPetugas ? currentUser?.rtRw.split("/")[1] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Struktur Wilayah UMKM
        </h1>
        <p className="text-muted-foreground">
          Visualisasi hierarki data UMKM berdasarkan wilayah RT dan RW.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data UMKM per Wilayah</CardTitle>
          <CardDescription>
            {isPetugas
              ? `Menampilkan data untuk RW ${petugasRw}`
              : "Klik setiap RW dan RT untuk melihat daftar UMKM yang terdata."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(umkmByRw).length === 0 ? (
             <p className="text-center text-muted-foreground py-8">
                Tidak ada data UMKM untuk ditampilkan.
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
            {Object.entries(umkmByRw)
              .sort(([rwA], [rwB]) => rwA.localeCompare(rwB))
              .map(([rw, rts]) => {
                 const totalUmkmInRw = Object.values(rts).reduce((sum, umkms) => sum + umkms.length, 0);
                 return (
                    <AccordionItem value={`rw-${rw}`} key={rw}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-4">
                            <span>RW {rw}</span>
                            <Badge variant="secondary">{totalUmkmInRw} UMKM</Badge>
                        </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 border-l-2 border-primary/20 ml-2">
                        <Accordion type="multiple" className="w-full space-y-2">
                            {Object.entries(rts)
                            .sort(([rtA], [rtB]) => rtA.localeCompare(rtB))
                            .map(([rt, umkms]) => (
                                <AccordionItem value={`rt-${rt}`} key={rt}>
                                <AccordionTrigger className="bg-muted/50 px-4 rounded-md hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <span>RT {rt}</span>
                                        <Badge>{umkms.length} UMKM</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <ul className="space-y-3">
                                    {umkms.map((umkm) => (
                                        <li
                                        key={umkm.id}
                                        className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">
                                                    {umkm.businessName}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    Pemilik: {umkm.ownerName}
                                                </span>
                                            </div>
                                            <Badge variant="outline">{umkm.businessType}</Badge>
                                        </li>
                                    ))}
                                    </ul>
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                 )
              })}
          </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
