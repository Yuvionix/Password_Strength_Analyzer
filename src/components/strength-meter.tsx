"use client"

import { motion } from "framer-motion"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StrengthMeterProps {
  score: number
  strengthLabel: string
  entropy: number
}

export function StrengthMeter({ score, entropy }: StrengthMeterProps) {
  const getColor = () => {
    if (score < 20) return "bg-red-500"
    if (score < 40) return "bg-orange-500"
    if (score < 60) return "bg-yellow-500"
    if (score < 80) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getLabel = () => {
    if (score < 20) return "Very Weak"
    if (score < 40) return "Weak"
    if (score < 60) return "Moderate"
    if (score < 80) return "Strong"
    return "Very Strong"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-white">Strength: {getLabel()}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircle className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                <p>Entropy: {entropy.toFixed(1)} bits</p>
                <p className="text-xs text-slate-400 mt-1">Higher entropy = more secure password</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm text-slate-400">{score}%</span>
      </div>

      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
