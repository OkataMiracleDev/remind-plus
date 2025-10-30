import { Card } from "./ui/card"

export default function TeamCard({ name, code, color }: { name: string; code: string; color?: string | null }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Code: {code}</p>
        </div>
        {color && <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />}
      </div>
    </Card>
  )
}