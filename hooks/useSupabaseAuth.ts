"use client"
import { useAuthContext } from "../contexts/AuthContext"

export function useSupabaseAuth() {
  return useAuthContext()
}