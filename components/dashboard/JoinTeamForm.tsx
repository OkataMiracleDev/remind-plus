"use client"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

export default function JoinTeamForm() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async () => {
    setError(null); setSuccess(null)
    if (!code || code.length < 4) {
      setError("Team code is required")
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
    <Card className="p-6 space-y-4">
      <div>
        <label className="text-sm">Team Code</label>
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter team code" />
      </div>
      <Button onClick={onSubmit}>Join Team</Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </Card>
  )
}