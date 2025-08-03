
"use client";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as indonesiaLocale } from 'date-fns/locale';
import { Briefcase, Calendar, MapPin, Phone, User, Hash, CheckCircle, XCircle, Users } from "lucide-react";


type UmkmByRw = {
  [rw: string]: {
    [rt: string]: UMKM[];
  };
};

export default function StructurePage() {
  const [currentUser, setCurrentUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [allUmkm, setAllUmkm] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUmkm, setSelectedUmkm] = useState<UMKM | null>(null);

  useEffect(() => {
    async function fetchData() {
        const [user, umkmData] = await Promise.all([
            getCurrentUser(),
            getUmkmData()
        ]);
        setCurrentUser(user);
        setAllUmkm(umkmData);
        setLoading(false);
    }
    fetchData();
  }, []);


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

  if (loading) {
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
                    <CardTitle>Memuat Data...</CardTitle>
                    <CardDescription>
                        Harap tunggu sebentar.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Memuat data UMKM...
                    </div>
                </CardContent>
            </Card>
          </div>
      )
  }

  return (
    <>
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
                                            <div className="space-y-2">
                                                {umkms.map((umkm) => (
                                                    <Button
                                                    key={umkm.id}
                                                    variant="ghost"
                                                    className="flex justify-between items-center p-2 rounded-md w-full h-auto text-left"
                                                    onClick={() => setSelectedUmkm(umkm)}
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
                                                    </Button>
                                                ))}
                                            </div>
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
        <Dialog open={!!selectedUmkm} onOpenChange={(isOpen) => !isOpen && setSelectedUmkm(null)}>
            {selectedUmkm && (
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl mb-4">{selectedUmkm.businessName}</DialogTitle>
                        <Image src={selectedUmkm.imageUrl} alt={selectedUmkm.businessName} width={800} height={400} className="rounded-lg aspect-video object-cover border" data-ai-hint="business product" />
                        <div className="pt-4 text-left">
                            <p className="text-muted-foreground">{selectedUmkm.description}</p>
                        </div>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 text-sm py-4">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Pemilik</p>
                                <p className="text-muted-foreground">{selectedUmkm.ownerName}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Briefcase className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Jenis Usaha</p>
                                <p className="text-muted-foreground">{selectedUmkm.businessType}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Kontak</p>
                                <p className="text-muted-foreground">{selectedUmkm.contact}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Alamat</p>
                                <p className="text-muted-foreground">{selectedUmkm.address}, RT/RW {selectedUmkm.rtRw}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Tanggal Berdiri</p>
                                <p className="text-muted-foreground">{selectedUmkm.startDate ? format(new Date(selectedUmkm.startDate), "d MMMM yyyy", { locale: indonesiaLocale }) : '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Hash className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">NIB</p>
                                <p className="text-muted-foreground">{selectedUmkm.nib || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                            {selectedUmkm.status === 'aktif' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                            </div>
                            <div>
                                <p className="font-semibold">Status</p>
                                <p className="text-muted-foreground capitalize">{selectedUmkm.status}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <p className="font-semibold">Jumlah Karyawan</p>
                                <p className="text-muted-foreground">{selectedUmkm.employeeCount} orang</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    </>
  );
}
