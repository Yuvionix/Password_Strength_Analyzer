"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PasswordInput } from "@/components/password-input"
import { StrengthMeter } from "@/components/strength-meter"
import { FeedbackList } from "@/components/feedback-list"
import { PasswordSuggestions } from "@/components/password-suggestions"
import { PasswordVisualizer } from "@/components/password-visualizer"
import { analyzePassword } from "@/lib/password-analyzer"
import { Card, CardContent } from "@/components/ui/card"

// Define the correct shape for PasswordAnalysis
type Feedback = {
  type: "warning" | "success"
  message: string
}

type PasswordAnalysis = {
  score: number
  feedback: Feedback[]
  suggestions: string[]
  entropy: number
  strengthLabel: string
}

export function PasswordAnalyzer() {
  const [password, setPassword] = useState("")
  const [analysis, setAnalysis] = useState<PasswordAnalysis>({
    score: 0,
    feedback: [],
    suggestions: [],
    entropy: 0,
    strengthLabel: "None",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showVisualizer, setShowVisualizer] = useState(false)

  useEffect(() => {
    const analyze = async () => {
      if (!password) {
        setAnalysis({
          score: 0,
          feedback: [],
          suggestions: [],
          entropy: 0,
          strengthLabel: "None",
        })
        return
      }

      setIsAnalyzing(true)

      try {
        const result = await analyzePassword(password)
        setAnalysis(result)
      } catch (error) {
        console.error("Error analyzing password:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    const debounce = setTimeout(analyze, 300)
    return () => clearTimeout(debounce)
  }, [password])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isAnalyzing={isAnalyzing}
          />

          <AnimatePresence>
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-6"
              >
                <StrengthMeter
                  score={analysis.score}
                  strengthLabel={analysis.strengthLabel}
                  entropy={analysis.entropy}
                />

                <FeedbackList feedback={analysis.feedback} />

                {analysis.suggestions.length > 0 && (
                  <PasswordSuggestions suggestions={analysis.suggestions} />
                )}

                <div className="flex justify-center">
                  <motion.button
                    onClick={() => setShowVisualizer(!showVisualizer)}
                    className="text-sm text-slate-300 hover:text-white underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showVisualizer ? "Hide 3D Visualization" : "Show 3D Visualization"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showVisualizer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 300 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-[300px] relative rounded-lg overflow-hidden"
                    >
                      <PasswordVisualizer
                        password={password}
                        score={analysis.score}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
