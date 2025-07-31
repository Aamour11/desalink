"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";

export function UsersTable({ data }: { data: User[] }) {
  return (
    <ScrollArea className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Wilayah (RT/RW)</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    data-ai-hint="person avatar"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.id}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.role === "Admin Desa" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.rtRw}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild>
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Lihat Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
