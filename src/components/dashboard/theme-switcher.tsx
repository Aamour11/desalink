"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
        </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setTheme("light")}
        size="sm"
      >
        <Sun className="mr-2" />
        Terang
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setTheme("dark")}
        size="sm"
      >
        <Moon className="mr-2" />
        Gelap
      </Button>
       <Button
        variant={theme === "system" ? "default" : "outline"}
        onClick={() => setTheme("system")}
        size="sm"
      >
        Sistem
      </Button>
    </div>
  )
}
