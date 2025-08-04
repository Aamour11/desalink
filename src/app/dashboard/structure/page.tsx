
"use client";

import { getUmkmData, getCurrentUser, deactivateUmkm } from "@/server/actions";
import type { UMKM, User } from "@/lib/types";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { id as indonesiaLocale } from 'date-fns/locale';
import { Briefcase, Calendar, MapPin, Phone, User as UserIcon, Hash, CheckCircle, XCircle, Users, FileCheck2, AlertTriangle, Clock, PowerOff, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";


type UmkmByRw = {
  [rw: string]: {
    [rt: string]: UMKM[];
  };
};

export default function StructurePage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password_hash'> | null>(null);
  const [allUmkm, setAllUmkm] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUmkm, setSelectedUmkm] = useState<UMKM | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fetchData = async () => {
      setLoading(true);
      try {
        const [user, umkmData] = await Promise.all([
            getCurrentUser(),
            getUmkmData()
        ]);
        setCurrentUser(user);
        setAllUmkm(umkmData);
      } catch (error) {
        toast({ variant: "destructive", title: "Gagal memuat data." });
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const umkmByRw: UmkmByRw = useMemo(() => allUmkm.reduce((acc, umkm) => {
    const [rt, rw] = umkm.rtRw.split("/");
    if (!acc[rw]) {
      acc[rw] = {};
    }
    if (!acc[rw][rt]) {
      acc[rw][rt] = [];
    }
    acc[rw][rt].push(umkm);
    return acc;
  }, {} as UmkmByRw), [allUmkm]);
  
  const handleDeactivate = async () => {
    if (!selectedUmkm) return;
    setIsDeactivating(true);
    try {
      await deactivateUmkm(selectedUmkm.id);
      toast({
        title: "Sukses",
        description: `${selectedUmkm.businessName} telah dinonaktifkan.`,
      });
      // Close dialog and refresh data
      setSelectedUmkm(null);
      await fetchData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast({
        variant: "destructive",
        title: "Gagal Menonaktifkan",
        description: errorMessage,
      });
    } finally {
      setIsDeactivating(false);
      setIsAlertOpen(false);
    }
  };

  const legalityInfo = {
    'Lengkap': { icon: <FileCheck2 className="h-5 w-5 text-green-600" />, text: "Lengkap", color: "success" },
    'Tidak Lengkap': { icon: <AlertTriangle className="h-5 w-5 text-red-600" />, text: "Tidak Lengkap", color: "destructive" },
    'Sedang Diproses': { icon: <Clock className="h-5 w-5 text-yellow-600" />, text: "Sedang Diproses", color: "secondary" }
  } as const;


  const isPetugas = currentUser?.role === "Petugas RT/RW";
  const petugasRw = isPetugas ? currentUser?.rtRw.split("/")[1] : null;

  if (loading) {
      return <Loading />;
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
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                {selectedUmkm && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">{selectedUmkm.businessName}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto -mr-6 pr-6 space-y-4">
                             <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                <Image 
                                    src={selectedUmkm.imageUrl} 
                                    alt={selectedUmkm.businessName} 
                                    fill
                                    className="object-cover" 
                                    data-ai-hint="business product" 
                                    unoptimized
                                />
                            </div>
                            
                            <div className="text-left">
                                <p className="text-muted-foreground">{selectedUmkm.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm py-4 border-t border-b">
                                <div className="flex items-start gap-3">
                                    <UserIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Pemilik</p>
                                        <p className="text-muted-foreground">{selectedUmkm.ownerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Briefcase className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Jenis Usaha</p>
                                        <p className="text-muted-foreground">{selectedUmkm.businessType}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Kontak</p>
                                        <p className="text-muted-foreground">{selectedUmkm.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Alamat</p>
                                        <p className="text-muted-foreground">{selectedUmkm.address}, RT/RW {selectedUmkm.rtRw}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Tanggal Berdiri</p>
                                        <p className="text-muted-foreground">{selectedUmkm.startDate ? format(new Date(selectedUmkm.startDate), "d MMMM yyyy", { locale: indonesiaLocale }) : '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Berlaku Hingga</p>
                                        <p className="text-muted-foreground">{selectedUmkm.endDate ? format(new Date(selectedUmkm.endDate), "d MMMM yyyy", { locale: indonesiaLocale }) : '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">NIB</p>
                                        <p className="text-muted-foreground">{selectedUmkm.nib || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                    {selectedUmkm.status === 'aktif' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">Status Operasional</p>
                                        <p className="text-muted-foreground capitalize">{selectedUmkm.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Jumlah Karyawan</p>
                                        <p className="text-muted-foreground">{selectedUmkm.employeeCount} orang</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                     <div className="mt-1 flex-shrink-0">
                                        {legalityInfo[selectedUmkm.legality].icon}
                                     </div>
                                     <div>
                                        <p className="font-semibold">Status Legalitas</p>
                                        <p className="text-muted-foreground capitalize">{selectedUmkm.legality}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                     <div className="mt-1 flex-shrink-0">
                                        <FileText className="h-5 w-5 text-primary" />
                                     </div>
                                     <div>
                                        <p className="font-semibold">Dokumen Legalitas</p>
                                        {selectedUmkm.legalityDocumentUrl ? (
                                             <Button variant="link" asChild className="p-0 h-auto">
                                                <Link href={selectedUmkm.legalityDocumentUrl} target="_blank" rel="noopener noreferrer">
                                                    Lihat Dokumen
                                                    <Download className="h-4 w-4 ml-2" />
                                                </Link>
                                             </Button>
                                        ) : (
                                            <p className="text-muted-foreground">Tidak diunggah</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {currentUser?.role === 'Admin Desa' && selectedUmkm.status === 'aktif' && (
                             <div className="flex justify-end pt-4 border-t mt-auto">
                                <Button variant="destructive" onClick={() => setIsAlertOpen(true)} disabled={isDeactivating}>
                                    <PowerOff className="mr-2 h-4 w-4" />
                                    {isDeactivating ? "Menonaktifkan..." : "Nonaktifkan UMKM"}
                                </Button>
                             </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
             <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Nonaktifkan UMKM?</AlertDialogTitle>
                <AlertDialogDescription>
                    Anda yakin ingin menonaktifkan <span className="font-bold">{selectedUmkm?.businessName}</span>? Tindakan ini dapat diubah nanti oleh Petugas RT/RW terkait.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeactivate} className="bg-destructive hover:bg-destructive/90">
                    Ya, Nonaktifkan
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
