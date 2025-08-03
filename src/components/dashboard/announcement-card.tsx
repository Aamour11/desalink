
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, X } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { id as indonesiaLocale } from "date-fns/locale";
import { useState } from "react";
import { Button } from "../ui/button";

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="bg-primary/10 border-primary/20 relative">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex-shrink-0">
            <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="font-headline text-lg">Pengumuman</CardTitle>
          <CardDescription className="text-foreground/80 mt-1">
            {announcement.message}
          </CardDescription>
          <p className="text-xs text-muted-foreground mt-2">
            Dikirim {formatDistanceToNow(new Date(announcement.createdAt), {
              addSuffix: true,
              locale: indonesiaLocale,
            })}
          </p>
        </div>
      </CardHeader>
       <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => setIsVisible(false)}
        >
            <X className="h-4 w-4 text-muted-foreground" />
       </Button>
    </Card>
  );
}
