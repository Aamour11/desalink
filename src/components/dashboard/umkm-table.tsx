
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { UMKM } from "@/lib/types";
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
import { FileDown, FileText } from "lucide-react";

export function UmkmTable({ data }: { data: UMKM[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleExportCSV = () => {
    const csvData = Papa.unparse(data.map(d => ({
        "Nama Usaha": d.businessName,
        "Nama Pemilik": d.ownerName,
        "Jenis Usaha": d.businessType,
        "Alamat": d.address,
        "RT/RW": d.rtRw,
        "Kontak": d.contact,
        "Status": d.status,
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
      head: [["Nama Usaha", "Pemilik", "Jenis", "RT/RW", "Status"]],
      body: data.map(umkm => [umkm.businessName, umkm.ownerName, umkm.businessType, umkm.rtRw, umkm.status]),
      startY: 20,
      headStyles: { fillColor: [34, 47, 62] }, // hsl(215, 40%, 17%)
    });
    doc.save('laporan-umkm.pdf');
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            placeholder="Cari nama usaha, pemilik..."
            defaultValue={searchParams.get("q")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            defaultValue={searchParams.get("type") || "all"}
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
            defaultValue={searchParams.get("status") || "all"}
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
            {data.length > 0 ? (
              data.map((umkm) => (
                <TableRow key={umkm.id}>
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
                  <TableCell>
                    <UmkmTableActions umkmId={umkm.id} />
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
  );
}
