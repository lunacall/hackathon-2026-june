import { createFileRoute } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"

export const Route = createFileRoute("/_layout/settings")({
  component: ReferencesPage,
})

const REFERENCES = [
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 81 Chapter 2 - Section 303",
    url: "https://le.utah.gov/xcode/Title81/Chapter2/81-2-S303.html?v=C81-2-S303_2024090120240501",
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 26B Chapter 8 - Section 125",
    url: "https://le.utah.gov/xcode/Title26B/Chapter8/26B-8-S125.html",
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 63G Chapter 2 - Section 302",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S302.html?v=C63G-2-S302_2026010120250507",
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 63G Chapter 2 - Section 301",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S301.html?v=C63G-2-S301_2025101420251206",
  },
]

function ReferencesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resources</h2>
        <p className="text-xs text-muted-foreground mt-1">Reference documents and legal codes</p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                County
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Name
              </th>
              <th className="w-12 px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {REFERENCES.map((ref, i) => (
              <tr key={i} className="group hover:bg-muted/20">
                <td className="px-4 py-2.5 text-sm text-foreground font-medium">
                  {ref.state}
                </td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground">
                  {ref.county}
                </td>
                <td className="px-4 py-2.5 text-sm text-foreground">
                  {ref.name}
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
