import { addDays, format, startOfWeek } from "date-fns"

export default function Calendar({ date = new Date() }: { date?: Date }) {
  const start = startOfWeek(date)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => (
        <div key={d.toISOString()} className="rounded-md border p-3 text-center text-sm">
          <div className="font-medium">{format(d, "EEE")}</div>
          <div className="text-zinc-600 dark:text-zinc-400">{format(d, "MMM d")}</div>
        </div>
      ))}
    </div>
  )
}