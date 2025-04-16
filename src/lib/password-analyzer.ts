import commonPasswords from "./common-passwords"

interface PasswordAnalysis {
  score: number
  strengthLabel: string
  entropy: number
  feedback: Array<{
    type: "warning" | "success"
    message: string
  }>
  suggestions: string[]
}

// Client-side function to call the API
export async function analyzePassword(password: string): Promise<PasswordAnalysis> {
  if (!password) {
    return {
      score: 0,
      strengthLabel: "None",
      entropy: 0,
      feedback: [],
      suggestions: [],
    }
  }

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze password")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing password:", error)
    // Fallback to client-side analysis if API fails
    return analyzePasswordStrength(password)
  }
}

// Server-side function for password analysis
export function analyzePasswordStrength(password: string): PasswordAnalysis {
  const analysis: PasswordAnalysis = {
    score: 0,
    strengthLabel: "Very Weak",
    entropy: 0,
    feedback: [],
    suggestions: [],
  }

  // Check if password is empty
  if (!password) {
    return analysis
  }

  // Check length
  const length = password.length
  if (length < 8) {
    analysis.feedback.push({
      type: "warning",
      message: "Password is too short (minimum 8 characters recommended)",
    })
    analysis.suggestions.push("Use at least 8 characters")
  } else if (length >= 12) {
    analysis.feedback.push({
      type: "success",
      message: "Good password length",
    })
  } else {
    analysis.feedback.push({
      type: "warning",
      message: "Password could be longer for better security",
    })
    analysis.suggestions.push("Consider using 12+ characters for better security")
  }

  // Check for common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    analysis.feedback.push({
      type: "warning",
      message: "This is a commonly used password",
    })
    analysis.suggestions.push("Avoid using common passwords that are easy to guess")
  }

  // Check character variety
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password)

  const charTypes = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars]
  const charTypesCount = charTypes.filter(Boolean).length

  if (charTypesCount < 3) {
    analysis.feedback.push({
      type: "warning",
      message: "Password lacks variety in character types",
    })

    if (!hasLowercase) analysis.suggestions.push("Add lowercase letters")
    if (!hasUppercase) analysis.suggestions.push("Add uppercase letters")
    if (!hasNumbers) analysis.suggestions.push("Add numbers")
    if (!hasSpecialChars) analysis.suggestions.push("Add special characters (!@#$%^&*)")
  } else {
    analysis.feedback.push({
      type: "success",
      message: "Good mix of character types",
    })
  }

  // Check for sequential patterns
  const hasSequentialChars = checkForSequentialPatterns(password)
  if (hasSequentialChars) {
    analysis.feedback.push({
      type: "warning",
      message: "Contains sequential patterns (like '123' or 'abc')",
    })
    analysis.suggestions.push("Avoid sequential patterns like '123', 'abc', or keyboard rows")
  }

  // Check for repeated characters
  const hasRepeatedChars = /(.)\1{2,}/.test(password)
  if (hasRepeatedChars) {
    analysis.feedback.push({
      type: "warning",
      message: "Contains repeated characters",
    })
    analysis.suggestions.push("Avoid repeating the same character multiple times")
  }

  // Calculate entropy
  analysis.entropy = calculateEntropy(password)

  // Calculate final score (0-100)
  let score = 0

  // Length contributes up to 30 points
  score += Math.min(30, length * 2.5)

  // Character variety contributes up to 30 points
  score += charTypesCount * 7.5

  // Entropy contributes up to 30 points
  score += Math.min(30, analysis.entropy / 4)

  // Penalties
  if (commonPasswords.includes(password.toLowerCase())) score -= 30
  if (hasSequentialChars) score -= 15
  if (hasRepeatedChars) score -= 15

  // Ensure score is between 0-100
  analysis.score = Math.max(0, Math.min(100, Math.round(score)))

  // Set strength label
  if (analysis.score < 20) analysis.strengthLabel = "Very Weak"
  else if (analysis.score < 40) analysis.strengthLabel = "Weak"
  else if (analysis.score < 60) analysis.strengthLabel = "Moderate"
  else if (analysis.score < 80) analysis.strengthLabel = "Strong"
  else analysis.strengthLabel = "Very Strong"

  return analysis
}

// Calculate password entropy
function calculateEntropy(password: string): number {
  if (!password) return 0

  const length = password.length

  // Determine character pool size
  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 33 // Common special chars

  // Shannon entropy formula: L * log2(R)
  // where L is length and R is pool size
  return length * Math.log2(poolSize || 1)
}

// Check for sequential patterns
function checkForSequentialPatterns(password: string): boolean {
  const lowerPassword = password.toLowerCase()

  // Common sequences
  const sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl", "zxcvbnm"]

  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 2; i++) {
      const pattern = sequence.substring(i, i + 3)
      if (lowerPassword.includes(pattern)) {
        return true
      }
    }
  }

  return false
}
