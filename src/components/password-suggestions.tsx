"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"

interface PasswordSuggestionsProps {
  suggestions: string[]
}

export function PasswordSuggestions({ suggestions }: PasswordSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Suggestions</h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-2 text-sm bg-blue-500/10 text-blue-200 p-2 rounded-md"
          >
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{suggestion}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
