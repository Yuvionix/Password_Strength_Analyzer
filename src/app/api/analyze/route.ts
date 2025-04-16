import { NextResponse } from "next/server"
import { analyzePasswordStrength } from "@/lib/password-analyzer"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const analysis = analyzePasswordStrength(password)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing password:", error)
    return NextResponse.json({ error: "Failed to analyze password" }, { status: 500 })
  }
}
