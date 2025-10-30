import { z } from "zod"

export const joinTeamSchema = z.object({
  code: z.string().min(4)
})