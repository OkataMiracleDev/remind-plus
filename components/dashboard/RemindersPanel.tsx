"use client"
import { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

type Reminder = {
  id: string
  title: string
  description?: string
  date: string
  time: string
  recurring: boolean
}

export default function RemindersPanel() {
  const [items, setItems] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/reminders")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load reminders")
      setItems(json.reminders || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setError(null)
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, time })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create")
      setTitle(""); setDescription(""); setDate(""); setTime("")
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const update = async (id: string, patch: Partial<Reminder>) => {
    setError(null)
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update")
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const remove = async (id: string) => {
    setError(null)
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete")
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4 bg-white/80 backdrop-blur">
          <h3 className="text-lg font-semibold">Create a Reminder</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={create}>Add Reminder</Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4 bg-white/80 backdrop-blur">
          <h3 className="text-lg font-semibold">Your Reminders</h3>
          {loading ? (
            <p className="text-sm">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No reminders yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((r) => (
                <div key={r.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{r.title}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{r.description}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{new Date(r.date).toLocaleDateString()} • {r.time}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => update(r.id, { title: r.title + " ✨" })}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => remove(r.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
