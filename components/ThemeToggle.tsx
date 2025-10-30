"use client"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const isDark = saved ? saved === "dark" : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" onClick={toggle} className="bg-white/80 backdrop-blur dark:bg-black/50">
        {dark ? "Light Mode" : "Dark Mode"}
      </Button>
    </div>
  )
}
