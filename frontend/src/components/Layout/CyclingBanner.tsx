import { useEffect, useState } from "react"

const PRIMARY_FUNCTIONS = ["marriage license"]
const STATE = "Utah"
const COUNTY = "Salt Lake County"

function buildQuestions(fn: string, state: string, county: string) {
  return [
    `What personal data is collected in ${fn} of ${state}, ${county}?`,
    `Why is personal data collected in ${fn} of ${state}, ${county}?`,
    `How is personal data used in ${fn} of ${state}, ${county}?`,
    `What laws authorize the collection of personal data in ${fn} of ${state}, ${county}?`,
    `What records are created in ${fn} of ${state}, ${county}?`,
    `Who may access the data in ${fn} of ${state}, ${county}?`,
    `Which information should be public in ${fn} of ${state}, ${county}?`,
    `Which information should remain private in ${fn} of ${state}, ${county}?`,
    `What information should be redacted before release in ${fn} of ${state}, ${county}?`,
    `How long must records be retained in ${fn} of ${state}, ${county}?`,
    `When must records be destroyed in ${fn} of ${state}, ${county}?`,
  ]
}

const QUESTIONS = buildQuestions(PRIMARY_FUNCTIONS[0], STATE, COUNTY)

export function CyclingBanner() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % QUESTIONS.length)
        setVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 max-w-2xl overflow-hidden cursor-default select-none">
      <span className="flex-shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 tabular-nums">
        {index + 1}&thinsp;/&thinsp;{QUESTIONS.length}
      </span>
      <span
        className="truncate text-xs text-muted-foreground transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {QUESTIONS[index]}
      </span>
    </div>
  )
}
