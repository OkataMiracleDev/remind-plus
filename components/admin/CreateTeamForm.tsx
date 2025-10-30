"use client"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

export default function CreateTeamForm() {
  const [name, setName] = useState("")
  const [color, setColor] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async () => {
    setError(null); setSuccess(null)
    if (!name.trim()) {
      setError("Team name is required")
      return
    }
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color: color.trim() || undefined })
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Failed to create team")
    } else {
      setSuccess("Team created successfully")
      setName(""); setColor("")
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <Input placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Color (optional)" value={color} onChange={(e) => setColor(e.target.value)} />
      <Button onClick={onSubmit}>Create Team</Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </Card>
  )
}