import Link from "next/link"
import { cn } from "../../lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("min-h-screen relative overflow-hidden bg-linear-to-br from-pink-50 via-violet-50 to-cyan-50 dark:from-indigo-950 dark:via-purple-900 dark:to-slate-900")}> 
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <header className="sticky top-0 z-10 border-b border-violet-200/60 bg-white/80 backdrop-blur dark:bg-black/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="text-lg font-semibold text-violet-700 dark:text-violet-300">Remind+</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard/user" className="text-pink-700 dark:text-pink-300 hover:underline">User</Link>
            <Link href="/dashboard/admin" className="text-cyan-700 dark:text-cyan-300 hover:underline">Admin</Link>
            <Link href="/join-team" className="text-violet-700 dark:text-violet-300 hover:underline">Join Team</Link>
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
