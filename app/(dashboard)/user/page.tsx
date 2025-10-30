import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import JoinTeamForm from "../../../components/dashboard/JoinTeamForm"
import RemindersPanel from "../../../components/dashboard/RemindersPanel"

export default function UserPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Reminders</h1>
      <RemindersPanel />
      <div>
        <h2 className="text-lg font-semibold">Join a Team</h2>
        <JoinTeamForm />
      </div>
    </div>
  )
}
