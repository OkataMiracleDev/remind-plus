"use client"
import Link from "next/link"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const slides = [0, 1, 2]
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const role = session?.user?.user_metadata?.role
      if (session) {
        if (role === "admin") router.replace("/dashboard/admin")
        else router.replace("/dashboard/user")
      }
    }
    check()
  }, [router])

  const scrollTo = (i: number) => {
    const el = sliderRef.current
    if (!el) return
    const width = el.clientWidth
    el.scrollTo({ left: width * i, behavior: "smooth" })
    setIndex(i)
  }

  const onScroll = () => {
    const el = sliderRef.current
    if (!el) return
    const width = el.clientWidth
    const i = Math.round(el.scrollLeft / width)
    if (i !== index) setIndex(i)
  }

  const IllustrationTeam = () => (
    <svg viewBox="0 0 200 120" className="w-full h-40">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fb7185" }} />
          <stop offset="50%" style={{ stopColor: "#a78bfa" }} />
          <stop offset="100%" style={{ stopColor: "#22d3ee" }} />
        </linearGradient>
      </defs>
      <rect x="10" y="20" width="180" height="80" rx="16" fill="url(#grad1)" opacity="0.15" />
      <circle cx="60" cy="60" r="22" fill="#fda4af" />
      <circle cx="100" cy="60" r="22" fill="#a78bfa" />
      <circle cx="140" cy="60" r="22" fill="#22d3ee" />
      <path d="M40 95 Q60 75 80 95" stroke="#fda4af" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M80 95 Q100 75 120 95" stroke="#a78bfa" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M120 95 Q140 75 160 95" stroke="#22d3ee" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  )

  const IllustrationCollab = () => (
    <svg viewBox="0 0 200 120" className="w-full h-40">
      <rect x="10" y="20" width="180" height="80" rx="16" fill="#c4b5fd" opacity="0.2" />
      <circle cx="70" cy="60" r="18" fill="#fb7185" />
      <circle cx="130" cy="60" r="18" fill="#22d3ee" />
      <path d="M70 60 H130" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" />
      <path d="M60 90 Q100 70 140 90" stroke="#a78bfa" strokeWidth="6" opacity="0.6" fill="none" />
    </svg>
  )

  const IllustrationCalendar = () => (
    <svg viewBox="0 0 200 120" className="w-full h-40">
      <rect x="35" y="25" width="130" height="80" rx="12" fill="#22d3ee" opacity="0.15" />
      <rect x="45" y="35" width="110" height="20" rx="8" fill="#a78bfa" />
      <rect x="45" y="60" width="25" height="20" rx="6" fill="#fb7185" />
      <rect x="75" y="60" width="25" height="20" rx="6" fill="#22d3ee" />
      <rect x="105" y="60" width="25" height="20" rx="6" fill="#f59e0b" />
      <rect x="135" y="60" width="20" height="20" rx="6" fill="#34d399" />
      <circle cx="155" cy="35" r="6" fill="#f59e0b" />
    </svg>
  )
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-pink-50 via-violet-50 to-cyan-50 dark:from-indigo-950 dark:via-purple-900 dark:to-slate-900">
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <section className="mx-auto max-w-5xl py-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Remind+ — plan together, never miss a beat</h1>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300">Create teams, share reminders, and visualize your week with a clean calendar.</p>
        </div>

        <div className="mt-4 relative">
          <div
            ref={sliderRef}
            onScroll={onScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Slide 1 */}
            <div className="min-w-full snap-center px-4 py-10">
              <Card className="mx-auto max-w-3xl p-6 sm:p-8 bg-white/85 dark:bg-zinc-900/70 backdrop-blur shadow-xl dark:shadow-black/30 border border-zinc-200 dark:border-zinc-800">
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Create and manage teams</h2>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Spin up a team, invite members, and set a colorful theme. Perfect for squads, clubs, or small businesses.</p>
                  </div>
                  <IllustrationTeam />
                </div>
              </Card>
            </div>

            {/* Slide 2 */}
            <div className="min-w-full snap-center px-4 py-10">
              <Card className="mx-auto max-w-3xl p-6 sm:p-8 bg-white/85 dark:bg-zinc-900/70 backdrop-blur shadow-xl dark:shadow-black/30 border border-zinc-200 dark:border-zinc-800">
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Collaborate and join with codes</h2>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Join a team using a unique code. Share tasks and reminders—everyone stays aligned and in sync.</p>
                  </div>
                  <IllustrationCollab />
                </div>
              </Card>
            </div>

            {/* Slide 3 */}
            <div className="min-w-full snap-center px-4 py-10">
              <Card className="mx-auto max-w-3xl p-6 sm:p-8 bg-white/85 dark:bg-zinc-900/70 backdrop-blur shadow-xl dark:shadow-black/30 border border-zinc-200 dark:border-zinc-800">
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Schedule reminders on your calendar</h2>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Set one‑off or recurring reminders, visualize your week, and get notified so nothing slips.</p>
                  </div>
                  <IllustrationCalendar />
                </div>
              </Card>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 mx-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => scrollTo(Math.max(0, index - 1))}>Prev</Button>
            <div className="flex items-center gap-2">
              {slides.map((s) => (
                <button
                  key={s}
                  aria-label={`Go to slide ${s + 1}`}
                  onClick={() => scrollTo(s)}
                  className={`h-2 w-8 rounded-full transition-colors ${index === s ? 'bg-violet-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                />
              ))}
            </div>
            <Button onClick={() => scrollTo(Math.min(2, index + 1))}>Next</Button>
          </div>
        </div>

        <div className="mt-8 flex  flex-wrap gap-6 justify-center items-center">
          <Link href="/auth/signup-client"><Button variant="outline" className="border-pink-400 text-pink-600 hover:bg-pink-50">Client Sign Up</Button></Link>
          <Link href="/auth/signup-admin"><Button variant="outline" className="border-cyan-400 text-cyan-600 hover:bg-cyan-50">Admin Sign Up</Button></Link>
          <Link href="/auth/login"><Button className="bg-violet-600 dark:bg-violet-400 hover:bg-violet-700">Sign In</Button></Link>
        </div>
      </section>
    </div>
  )
}
