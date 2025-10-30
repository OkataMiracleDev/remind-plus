"use client"
import { useState } from "react"
import { useSupabaseAuth } from "../../../hooks/useSupabaseAuth"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SignupPage() {
  const { signUp, loading } = useSupabaseAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async () => {
    setError(null)
    try {
      await signUp(email, password, name)
      router.push("/dashboard/user")
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign up")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-cyan-50 dark:from-indigo-950 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
      <Card className="p-8 space-y-6 shadow-xl bg-white/85 dark:bg-zinc-900/70 backdrop-blur border border-zinc-200 dark:border-zinc-800 dark:shadow-black/30">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Create Account</h1>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400" onClick={onSubmit} disabled={loading}>Sign Up</Button>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </Card>
      </motion.div>
    </div>
  )
}
