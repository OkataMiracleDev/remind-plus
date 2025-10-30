import { z } from "zod"

export const createReminderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  time: z.string(),
  recurring: z.boolean().optional(),
  teamId: z.string()
})