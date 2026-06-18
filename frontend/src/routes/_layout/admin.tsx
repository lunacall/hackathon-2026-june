import { createFileRoute } from "@tanstack/react-router"
import { Plus, Trash2, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getReferencesForUnit } from "@/lib/references"

export const Route = createFileRoute("/_layout/admin")({
  component: GovernmentUnitsPage,
})

type Unit = { id: number; state: string; governmentType: string; governmentUnit: string; office: string }

const GOV_TYPE_COLORS: Record<string, string> = {
  "County":           "bg-blue-100 text-blue-700",
  "Municipality":     "bg-purple-100 text-purple-700",
  "Public Education": "bg-amber-100 text-amber-700",
  "Service District": "bg-teal-100 text-teal-700",
}

const INITIAL_UNITS: Unit[] = [
  { id:  1, state: "UT", governmentType: "County",           governmentUnit: "Utah County",                                        office: "Clerk" },
  { id:  2, state: "UT", governmentType: "County",           governmentUnit: "Beaver County",                                      office: "Clerk" },
  { id:  3, state: "UT", governmentType: "County",           governmentUnit: "Box Elder County",                                   office: "Clerk" },
  { id:  4, state: "UT", governmentType: "County",           governmentUnit: "Cache County",                                       office: "Clerk" },
  { id:  5, state: "UT", governmentType: "County",           governmentUnit: "Carbon County",                                      office: "Clerk" },
  { id:  6, state: "UT", governmentType: "Municipality",     governmentUnit: "Salt Lake City",                                     office: "Recorder" },
  { id:  7, state: "UT", governmentType: "Municipality",     governmentUnit: "Provo City",                                         office: "Recorder" },
  { id:  8, state: "UT", governmentType: "Municipality",     governmentUnit: "Ogden City",                                         office: "Recorder" },
  { id:  9, state: "UT", governmentType: "Municipality",     governmentUnit: "St. George City",                                    office: "Recorder" },
  { id: 10, state: "UT", governmentType: "Municipality",     governmentUnit: "Logan City",                                         office: "Recorder" },
  { id: 11, state: "UT", governmentType: "Municipality",     governmentUnit: "Lehi City",                                          office: "Recorder" },
  { id: 12, state: "UT", governmentType: "Public Education", governmentUnit: "Alpine School District",                             office: "Board of Education" },
  { id: 13, state: "UT", governmentType: "Public Education", governmentUnit: "Davis School District",                              office: "Board of Education" },
  { id: 14, state: "UT", governmentType: "Public Education", governmentUnit: "Granite School District",                            office: "Board of Education" },
  { id: 15, state: "UT", governmentType: "Public Education", governmentUnit: "Jordan School District",                             office: "Board of Education" },
  { id: 16, state: "UT", governmentType: "Public Education", governmentUnit: "Salt Lake City School District",                     office: "Board of Education" },
  { id: 17, state: "UT", governmentType: "Public Education", governmentUnit: "Washington School District",                         office: "Board of Education" },
  { id: 18, state: "UT", governmentType: "Public Education", governmentUnit: "Weber School District",                              office: "Board of Education" },
  { id: 19, state: "UT", governmentType: "Service District", governmentUnit: "Greater Salt Lake Municipal Services District",      office: "Board of Trustees" },
  { id: 20, state: "UT", governmentType: "Service District", governmentUnit: "Alpine Cove Water Special Service District",         office: "Board" },
  { id: 21, state: "UT", governmentType: "Service District", governmentUnit: "Alta Canyon Sports Center Special Service District", office: "Board" },
  { id: 22, state: "UT", governmentType: "Service District", governmentUnit: "Ash Creek Special Service District",                 office: "Board" },
  { id: 23, state: "UT", governmentType: "Service District", governmentUnit: "Bear Lake Special Service District",                 office: "Board" },
  { id: 24, state: "UT", governmentType: "Service District", governmentUnit: "Beaver County Special Service District #2",          office: "Board" },
  { id: 25, state: "UT", governmentType: "Service District", governmentUnit: "Beaver County Hospital Service District #3",         office: "Board" },
]

function GovernmentUnitsPage() {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newState, setNewState] = useState("")
  const [newGovType, setNewGovType] = useState("")
  const [newGovUnit, setNewGovUnit] = useState("")
  const [newOffice, setNewOffice] = useState("")
  const [generatingIds, setGeneratingIds] = useState<Set<number>>(new Set())
  const [generatedIds, setGeneratedIds] = useState<Set<number>>(new Set())
  const [errorIds, setErrorIds] = useState<Set<number>>(new Set())

  function handleDelete(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id))
  }

  async function handleGenerate(unit: Unit) {
    setGeneratingIds(prev => new Set(prev).add(unit.id))
    setErrorIds(prev => { const s = new Set(prev); s.delete(unit.id); return s })
    try {
      const token = localStorage.getItem("access_token")
      const refs = getReferencesForUnit(unit.governmentUnit).map(r => ({
        name: r.name,
        url: r.url,
        agents: r.agents,
      }))
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/governance-model/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            government_unit: unit.governmentUnit,
            office: unit.office,
            references: refs,
          }),
        }
      )
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${unit.governmentUnit.replace(/ /g, "_")}_${unit.office.replace(/ /g, "_")}_governance_model.csv`
      a.click()
      URL.revokeObjectURL(url)
      setGeneratedIds(prev => new Set(prev).add(unit.id))
    } catch {
      setErrorIds(prev => new Set(prev).add(unit.id))
    } finally {
      setGeneratingIds(prev => { const s = new Set(prev); s.delete(unit.id); return s })
    }
  }

  function handleAdd() {
    if (!newState.trim() || !newGovType.trim() || !newGovUnit.trim() || !newOffice.trim()) return
    const next = Math.max(0, ...units.map((u) => u.id)) + 1
    setUnits((prev) => [
      ...prev,
      { id: next, state: newState.trim().toUpperCase(), governmentType: newGovType.trim(), governmentUnit: newGovUnit.trim(), office: newOffice.trim() },
    ])
    setNewState("")
    setNewGovType("")
    setNewGovUnit("")
    setNewOffice("")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Government Units
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {units.length} units
          </span>
        </h2>
        <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => setDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add unit
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-10 px-4 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">State</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Government Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Government Unit</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Office</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {units.map((unit, i) => {
              const isGenerating = generatingIds.has(unit.id)
              const isGenerated = generatedIds.has(unit.id)
              const hasError = errorIds.has(unit.id)
              return (
                <tr key={unit.id} className="group hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {unit.state}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={`text-[10px] ${GOV_TYPE_COLORS[unit.governmentType] || "bg-gray-100 text-gray-700"}`}>
                      {unit.governmentType}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-foreground">{unit.governmentUnit}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">{unit.office}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className={`h-7 text-xs gap-1.5 text-white ${hasError ? "bg-red-500 hover:bg-red-600" : "bg-violet-600 hover:bg-violet-700"}`}
                        disabled={isGenerating || isGenerated}
                        onClick={() => handleGenerate(unit)}
                      >
                        {isGenerating ? (
                          <><Loader2 className="h-3 w-3 animate-spin" />Generating...</>
                        ) : isGenerated ? (
                          <><CheckCircle2 className="h-3 w-3" />Generated</>
                        ) : hasError ? (
                          <><AlertCircle className="h-3 w-3" />Retry</>
                        ) : (
                          <><Sparkles className="h-3 w-3" />Generate</>
                        )}
                      </Button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="invisible rounded p-1 text-muted-foreground/50 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:visible"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">Add government unit</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">State abbreviation</Label>
              <Input placeholder="e.g. UT" value={newState} onChange={(e) => setNewState(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Government Type</Label>
              <Input placeholder="e.g. County" value={newGovType} onChange={(e) => setNewGovType(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Government Unit</Label>
              <Input placeholder="e.g. Salt Lake County" value={newGovUnit} onChange={(e) => setNewGovUnit(e.target.value)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Office</Label>
              <Input placeholder="e.g. Clerk" value={newOffice} onChange={(e) => setNewOffice(e.target.value)} className="h-8 text-sm" onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="h-7 text-xs" onClick={handleAdd} disabled={!newState.trim() || !newGovType.trim() || !newGovUnit.trim() || !newOffice.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
