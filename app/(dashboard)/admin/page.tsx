import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import CreateTeamForm from "../../../components/admin/CreateTeamForm"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <Card className="p-6 space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage teams and reminders.</p>
        <div className="mt-2">
          <h2 className="text-lg font-semibold">Create a Team</h2>
          <CreateTeamForm />
        </div>
      </Card>
    </div>
  )
}