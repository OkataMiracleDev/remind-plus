import { describe, it, expect } from "vitest"
import { generateTeamCode } from "../lib/teamCode"

describe("generateTeamCode", () => {
  it("generates a 6-character code", () => {
    const code = generateTeamCode()
    expect(code).toHaveLength(6)
  })
  it("only uses allowed characters", () => {
    const code = generateTeamCode()
    expect(/^[A-Z2-9]{6}$/i.test(code)).toBe(true)
  })
})