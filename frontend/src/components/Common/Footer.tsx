import { Sparkles } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [modelName, setModelName] = useState("")

  return (
    <footer className="border-t py-4 px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="What personal data is collected for marriage license of Utah, Salt Lake County?"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="h-8 bg-transparent border border-input rounded px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </footer>
  )
}
