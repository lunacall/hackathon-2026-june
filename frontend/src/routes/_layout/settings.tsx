import { createFileRoute } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { REFERENCES, AGENT_LABELS, AGENT_COLORS } from "@/lib/references"

export const Route = createFileRoute("/_layout/settings")({
  component: ReferencesPage,
})

const CATEGORY_COLORS: Record<string, string> = {
  "Governance":       "bg-blue-100 text-blue-700",
  "Student Records":  "bg-purple-100 text-purple-700",
  "Retention":        "bg-amber-100 text-amber-700",
  "Legal Authority":  "bg-teal-100 text-teal-700",
  "Utah Code":        "bg-slate-100 text-slate-700",
}

function ReferencesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">References</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Reference documents and legal codes — {REFERENCES.length} sources
        </p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-10 px-4 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">State</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Government Unit</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Agents</th>
              <th className="w-12 px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {REFERENCES.map((ref, i) => (
              <tr key={i} className="group hover:bg-muted/20">
                <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {ref.state}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <Badge className={`text-[10px] ${CATEGORY_COLORS[ref.category] || "bg-gray-100 text-gray-700"}`}>
                    {ref.category}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{ref.governmentUnit}</td>
                <td className="px-4 py-2.5 text-sm text-foreground">{ref.name}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {ref.agents.map((agent) => (
                      <span
                        key={agent}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${AGENT_COLORS[agent] || "bg-gray-100 text-gray-700"}`}
                      >
                        {AGENT_LABELS[agent] || agent}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
