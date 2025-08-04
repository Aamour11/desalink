
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { format } from "date-fns";
import { id as indonesiaLocale } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { UMKM, User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UmkmTableActions } from "./umkm-table-actions";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Briefcase, Calendar, MapPin, Phone, User as UserIcon, Hash, CheckCircle, XCircle, Users, FileCheck2, AlertTriangle, Clock, PowerOff, FileDown, FileText, Download } from "lucide-react";

export function UmkmTable({ data, currentUser }: { data: UMKM[], currentUser: Omit<User, 'password_hash'> | null }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [selectedUmkm, setSelectedUmkm] = React.useState<UMKM | null>(null);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
       if (key === 'rw') {
        params.delete('rt');
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const rwFilter = searchParams.get("rw") || "all";
  const rtFilter = searchParams.get("rt") || "all";


  const allRws = React.useMemo(() => {
    const rws = new Set(data.map(umkm => umkm.rtRw.split('/')[1]));
    return Array.from(rws).sort();
  }, [data]);
  
  const rtsInSelectedRw = React.useMemo(() => {
    if (rwFilter === 'all') return [];
    const rts = new Set(data.filter(umkm => umkm.rtRw.split('/')[1] === rwFilter).map(umkm => umkm.rtRw.split('/')[0]));
    return Array.from(rts).sort();
  }, [data, rwFilter]);


  const filteredUmkm: UMKM[] = React.useMemo(() => 
    data.filter((umkm) => {
      const [rt, rw] = umkm.rtRw.split('/');
      const matchesQuery =
        umkm.businessName.toLowerCase().includes(query.toLowerCase()) ||
        umkm.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        umkm.rtRw.includes(query);
      const matchesType = typeFilter === "all" || umkm.businessType === typeFilter;
      const matchesStatus = statusFilter === "all" || umkm.status === statusFilter;
      const matchesRw = rwFilter === "all" || rw === rwFilter;
      const matchesRt = rtFilter === "all" || rt === rtFilter;
      return matchesQuery && matchesType && matchesStatus && matchesRw && matchesRt;
  }), [data, query, typeFilter, statusFilter, rwFilter, rtFilter]);


  const handleExportCSV = () => {
    const csvData = Papa.unparse(filteredUmkm.map(d => ({
        "Nama Usaha": d.businessName,
        "Nama Pemilik": d.ownerName,
        "Jenis Usaha": d.businessType,
        "Alamat": d.address,
        "RT/RW": d.rtRw,
        "Kontak": d.contact,
        "Status": d.status,
        "Legalitas": d.legality,
        "NIB": d.nib,
        "Tanggal Berdiri": d.startDate,
        "Jumlah Karyawan": d.employeeCount,
    })));
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "laporan-umkm.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data UMKM", 14, 16);
    autoTable(doc, {
      head: [["Nama Usaha", "Pemilik", "Jenis", "RT/RW", "Status", "Legalitas"]],
      body: filteredUmkm.map(umkm => [umkm.businessName, umkm.ownerName, umkm.businessType, umkm.rtRw, umkm.status, umkm.legality]),
      startY: 20,
      headStyles: { fillColor: [34, 47, 62] }, // hsl(215, 40%, 17%)
    });
    doc.save('laporan-umkm.pdf');
  };

  const isPetugas = currentUser?.role === 'Petugas RT/RW';
  const isAdmin = currentUser?.role === 'Admin Desa';
  
  const legalityInfo = {
    'Lengkap': { icon: <FileCheck2 className="h-5 w-5 text-green-600" />, text: "Lengkap", color: "success" },
    'Tidak Lengkap': { icon: <AlertTriangle className="h-5 w-5 text-red-600" />, text: "Tidak Lengkap", color: "destructive" },
    'Sedang Diproses': { icon: <Clock className="h-5 w-5 text-yellow-600" />, text: "Sedang Diproses", color: "secondary" }
  } as const;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="Cari nama usaha, pemilik..."
              defaultValue={searchParams.get("q")?.toString()}
              onChange={(e) => handleFilter("q", e.target.value)}
              className="max-w-xs"
            />
            <Select
              defaultValue={typeFilter}
              onValueChange={(value) => handleFilter("type", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="Kuliner">Kuliner</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                <SelectItem value="Jasa">Jasa</SelectItem>
                <SelectItem value="Pertanian">Pertanian</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={statusFilter}
              onValueChange={(value) => handleFilter("status", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
             {isAdmin && (
              <>
               <Select
                defaultValue={rwFilter}
                onValueChange={(value) => handleFilter("rw", value)}
                >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Semua RW" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua RW</SelectItem>
                    {allRws.map(rw => (
                        <SelectItem key={rw} value={rw}>RW {rw}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <Select
                    defaultValue={rtFilter}
                    onValueChange={(value) => handleFilter("rt", value)}
                    disabled={rwFilter === 'all'}
                    >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Semua RT" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua RT</SelectItem>
                        {rtsInSelectedRw.map(rt => (
                            <SelectItem key={rt} value={rt}>RT {rt}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </>
             )}
          </div>
          <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <FileDown className="mr-2 h-4 w-4" />
                Ekspor CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Ekspor PDF
              </Button>
          </div>
        </div>
        <ScrollArea className="rounded-lg border whitespace-nowrap shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Jenis Usaha</TableHead>
                <TableHead>RT/RW</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUmkm.length > 0 ? (
                filteredUmkm.map((umkm) => (
                  <TableRow key={umkm.id} onClick={() => setSelectedUmkm(umkm)} className="cursor-pointer">
                    <TableCell>
                      <Image
                        alt={umkm.businessName}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={umkm.imageUrl || "https://placehold.co/64x64.png"}
                        width="64"
                        data-ai-hint="business product"
                        unoptimized // Required for local images in /public
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {umkm.businessName}
                    </TableCell>
                    <TableCell>{umkm.ownerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{umkm.businessType}</Badge>
                    </TableCell>
                    <TableCell>{umkm.rtRw}</TableCell>
                    <TableCell>
                      <Badge variant={umkm.status === "aktif" ? "success" : "destructive"}>
                        {umkm.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {isPetugas && umkm.rtRw === currentUser?.rtRw && <UmkmTableActions umkmId={umkm.id} />}
                      {isAdmin && <UmkmTableActions umkmId={umkm.id} />}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada data yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}

    