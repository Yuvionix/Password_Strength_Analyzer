"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FeedbackListProps {
  feedback: Array<{
    type: "warning" | "success"
    message: string
  }>
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  if (feedback.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white">Analysis</h3>
      <ul className="space-y-2">
        <AnimatePresence>
          {feedback.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex items-start gap-2 text-sm p-2 rounded-md ${
                item.type === "warning" ? "bg-red-500/10 text-red-200" : "bg-green-500/10 text-green-200"
              }`}
            >
              {item.type === "warning" ? (
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <span>{item.message}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
