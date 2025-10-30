"use client"
import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { z } from "zod"

const schema = z.object({ code: z.string().min(4, "Team code is required") })

export default function JoinTeamPage() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async () => {
    setError(null); setSuccess(null)
    const parsed = schema.safeParse({ code })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid code")
      return
    }
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", code })
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Failed to join team")
    } else {
      setSuccess("Joined team successfully")
      setCode("")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Join a Team</h1>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm">Team Code</label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter team code" />
        </div>
        <Button onClick={onSubmit}>Join Team</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </Card>
    </div>
  )
}