"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Cari nama usaha, pemilik, atau RT/RW..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select
            defaultValue={searchParams.get("type") || "all"}
            onValueChange={(value) => handleFilter("type", value)}
          >
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       <ScrollArea className="rounded-md border whitespace-nowrap">
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
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={umkm.imageUrl || "https://placehold.co/64x64.png"}
                      width="64"
                      data-ai-hint="business product"
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
                    <Badge variant={umkm.status === "aktif" ? "default" : "secondary"}>
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
