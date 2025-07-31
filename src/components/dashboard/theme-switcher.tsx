"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setTheme("light")}
      >
        <Sun className="mr-2 h-4 w-4" />
        Terang
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="mr-2 h-4 w-4" />
        Gelap
      </Button>
       <Button
        variant={theme === "system" ? "default" : "outline"}
        onClick={() => setTheme("system")}
      >
        Sistem
      </Button>
    </div>
  )
}
