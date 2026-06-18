import { createFileRoute } from "@tanstack/react-router"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

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

export const Route = createFileRoute("/_layout/admin")({
  component: GovernmentUnitsPage,
})

type Unit = { id: number; state: string; county: string; office: string }

const INITIAL_UNITS = [
  { id: 1, state: "UT", county: "Beaver County", office: "Clerk" },
  { id: 2, state: "UT", county: "Box Elder County", office: "Clerk" },
  { id: 3, state: "UT", county: "Cache County", office: "Clerk" },
  { id: 4, state: "UT", county: "Carbon County", office: "Clerk" },
  { id: 5, state: "UT", county: "Daggett County", office: "Clerk" },
  { id: 6, state: "UT", county: "Davis County", office: "Clerk" },
  { id: 7, state: "UT", county: "Duchesne County", office: "Clerk" },
  { id: 8, state: "UT", county: "Emery County", office: "Clerk" },
  { id: 9, state: "UT", county: "Garfield County", office: "Clerk" },
  { id: 10, state: "UT", county: "Grand County", office: "Clerk" },
  { id: 11, state: "UT", county: "Iron County", office: "Clerk" },
  { id: 12, state: "UT", county: "Juab County", office: "Clerk" },
  { id: 13, state: "UT", county: "Kane County", office: "Clerk" },
  { id: 14, state: "UT", county: "Millard County", office: "Clerk" },
  { id: 15, state: "UT", county: "Morgan County", office: "Clerk" },
  { id: 16, state: "UT", county: "Piute County", office: "Clerk" },
  { id: 17, state: "UT", county: "Rich County", office: "Clerk" },
  { id: 18, state: "UT", county: "Salt Lake County", office: "Clerk" },
  { id: 19, state: "UT", county: "San Juan County", office: "Clerk" },
  { id: 20, state: "UT", county: "Sanpete County", office: "Clerk" },
  { id: 21, state: "UT", county: "Sevier County", office: "Clerk" },
  { id: 22, state: "UT", county: "Summit County", office: "Clerk" },
  { id: 23, state: "UT", county: "Tooele County", office: "Clerk" },
  { id: 24, state: "UT", county: "Uintah County", office: "Clerk" },
  { id: 25, state: "UT", county: "Utah County", office: "Clerk" },
  { id: 26, state: "UT", county: "Wasatch County", office: "Clerk" },
  { id: 27, state: "UT", county: "Washington County", office: "Clerk" },
  { id: 28, state: "UT", county: "Wayne County", office: "Clerk" },
  { id: 29, state: "UT", county: "Weber County", office: "Clerk" },
]

function GovernmentUnitsPage() {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newState, setNewState] = useState("")
  const [newCounty, setNewCounty] = useState("")
  const [newOffice, setNewOffice] = useState("")

  function handleDelete(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id))
  }

  function handleAdd() {
    if (!newState.trim() || !newCounty.trim() || !newOffice.trim()) return
    const next = Math.max(0, ...units.map((u) => u.id)) + 1
    setUnits((prev) => [
      ...prev,
      { id: next, state: newState.trim().toUpperCase(), county: newCounty.trim(), office: newOffice.trim() },
    ])
    setNewState("")
    setNewCounty("")
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
        <Button
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add unit
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-10 px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                State
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                County
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Office
              </th>
              <th className="w-12 px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {units.map((unit, i) => (
              <tr key={unit.id} className="group hover:bg-muted/20">
                <td className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-4 py-2.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                    {unit.state}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-foreground">
                  {unit.county}
                </td>
                <td className="px-4 py-2.5 text-sm text-foreground">
                  {unit.office}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="invisible rounded p-1 text-muted-foreground/50 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:visible"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
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
              <Input
                placeholder="e.g. UT"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">County</Label>
              <Input
                placeholder="e.g. Salt Lake County"
                value={newCounty}
                onChange={(e) => setNewCounty(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Office</Label>
              <Input
                placeholder="e.g. Clerk"
                value={newOffice}
                onChange={(e) => setNewOffice(e.target.value)}
                className="h-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleAdd}
              disabled={!newState.trim() || !newCounty.trim() || !newOffice.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
