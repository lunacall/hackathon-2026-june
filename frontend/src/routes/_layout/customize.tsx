import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute("/_layout/customize")({
  component: AgentCustomizationPage,
})

type Agent = {
  id: string
  name: string
  stage: number
  description: string
  defaultPrompt: string
  color: string
}

const AGENTS: Agent[] = [
  {
    id: "core_functions",
    name: "Core Functions",
    stage: 1,
    description: "Discovers the statutory responsibilities and obligations of the office.",
    defaultPrompt: "You are an expert in Utah government structure and functions.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "primary_duties",
    name: "Primary Duties",
    stage: 2,
    description: "Identifies specific tasks critical to each core function.",
    defaultPrompt: "You are an expert in government operations and statutory duties.",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "transactions",
    name: "Transactions",
    stage: 3,
    description: "Maps public-facing interactions and the records generated per duty.",
    defaultPrompt: "You are an expert in government transactions and record creation.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    id: "personal_data",
    name: "Personal Data",
    stage: 4,
    description: "Determines what personal data is collected, how it's used, and the legal basis.",
    defaultPrompt: "You are an expert in data privacy and government records management.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "retention",
    name: "Retention",
    stage: 5,
    description: "Assigns record classification, retention period, and general schedule.",
    defaultPrompt: "You are an expert in records retention and classification.",
    color: "bg-amber-100 text-amber-700",
  },
]

const AGENT_USER_PROMPTS: Record<string, string> = {
  core_functions:
    "For {office} in {government_unit}, identify all Core Functions.\n\nCore Functions: A governmental entity's statutory responsibilities or obligations.\n\n{sources}\n\nReturn ONLY a JSON array of strings, one per core function. Example:\n[\"Marriage licenses\", \"Business licenses\", \"Records management\"]",
  primary_duties:
    "For {office} in {government_unit}, identify all Primary Duties for the core function: {core_function}\n\nPrimary Duties: Specific tasks or actions that are critical to a governmental entity's purpose, mission, or operation.\n\n{sources}\n\nReturn ONLY a JSON array of strings, one per primary duty. Example:\n[\"Issue licenses\", \"Process applications\", \"Maintain records\"]",
  transactions:
    "For {office} in {government_unit}, identify all Transactions for:\nCore Function: {core_function}\nPrimary Duty: {primary_duty}\n\nTransaction: Any interaction or exchange between a governmental entity and a member of the public in furtherance of the governmental entity's primary duties.\nRelated Records: Documentary material or data, either in an electronic or physical format, that is collected or generated in the course of a transaction.\n\n{sources}\n\nReturn ONLY a JSON array of objects with 'transaction' and 'related_records' keys. Example:\n[{\"transaction\": \"Process application\", \"related_records\": \"Application form and supporting documents\"}, ...]",
  personal_data:
    "For {office} in {government_unit}:\nCore Function: {core_function}\nPrimary Duty: {primary_duty}\nTransaction: {transaction}\nRelated Records: {related_records}\n\nFill in these columns (return as JSON object):\n- personal_data: Any information contained in a record that is linked or can be reasonably linked to an identified individual.\n- use_of_data: How personal data is processed or any operations performed on personal data.\n- purpose: The reason why personal data is processed.\n- statutory_auth: The legal authority that requires or allows a governmental entity to process personal data.\n- value_of_records: The historical, administrative, legal or fiscal value of the record.\n\n{sources}\n\nReturn ONLY valid JSON with these 5 keys.",
  retention:
    "For {office} in {government_unit}:\nCore Function: {core_function}\nPrimary Duty: {primary_duty}\nTransaction: {transaction}\nRelated Records: {related_records}\n\nFill in these columns (return as JSON object):\n- primary_classification: How the record is generally classified (private, controlled, protected, or exempt) and the citation.\n- secondary_classification: The classification of any personal data contained in a record and the citation.\n- retention_disposition: How long the records must be retained and when the records must be destroyed.\n- general_schedule: The reference code or name of the retention schedule that applies.\n\n{sources}\n\nReturn ONLY valid JSON with these 4 keys.",
}

function AgentCustomizationPage() {
  const [prompts, setPrompts] = useState<Record<string, string>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, AGENT_USER_PROMPTS[a.id] ?? ""]))
  )
  const [userPrompts, setUserPrompts] = useState<Record<string, string>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, a.defaultPrompt]))
  )
  const [instructions, setInstructions] = useState<Record<string, string>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, ""]))
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Agent Customization</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Configure the system prompt and user prompt for each agent in the orchestration pipeline.
        </p>
      </div>

      <div className="space-y-4">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="rounded-md border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground tabular-nums w-5">
                {agent.stage}
              </span>
              <Badge className={`text-[10px] ${agent.color}`}>{agent.name}</Badge>
              <p className="text-xs text-muted-foreground">{agent.description}</p>
            </div>

            <div className="pl-8 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">System Prompt</label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
                  rows={6}
                  value={prompts[agent.id]}
                  onChange={(e) =>
                    setPrompts((prev) => ({ ...prev, [agent.id]: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">User Prompt <span className="text-muted-foreground font-normal">(optional override)</span></label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
                  rows={2}
                  placeholder={agent.defaultPrompt}
                  value={userPrompts[agent.id]}
                  onChange={(e) =>
                    setUserPrompts((prev) => ({ ...prev, [agent.id]: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="pl-8 space-y-1.5">
              <label className="text-xs font-medium text-foreground">Additional Instructions</label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={2}
                placeholder="e.g. Focus only on records that contain student data. Always cite a Utah Code section."
                value={instructions[agent.id]}
                onChange={(e) =>
                  setInstructions((prev) => ({ ...prev, [agent.id]: e.target.value }))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
