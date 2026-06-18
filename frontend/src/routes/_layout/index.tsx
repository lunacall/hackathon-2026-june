import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/")({
  component: UpdatesPage,
})

type FieldChange = {
  id: string
  field: string
  oldValue: string
  newValue: string
  status: "needs-answer" | "flagged" | "approved"
}

type Update = {
  id: string
  county: string
  state: string
  date: string
  transaction: string
  changes: FieldChange[]
}

const UPDATES: Update[] = [
  {
    id: "1",
    county: "Salt Lake County",
    state: "Utah",
    date: "2025-06-15",
    transaction: "Issue marriage licenses - Process application and payment",
    changes: [
      {
        id: "1-1",
        field: "Primary Duties",
        oldValue: "Process application and payment",
        newValue: "Process application, payment, and identity verification",
        status: "needs-answer",
      },
      {
        id: "1-2",
        field: "Transactions",
        oldValue: "Application for License to Marry and receipt of payment",
        newValue: "Application for License to Marry, receipt of payment, and identity verification documents",
        status: "flagged",
      },
      {
        id: "1-3",
        field: "Personal Data in the Records",
        oldValue: "The couple's full names including maiden or bachelor name, social security number, current address, date and place of birth",
        newValue: "The couple's full names including maiden or bachelor name, social security number, current address, date and place of birth, passport number",
        status: "approved",
      },
      {
        id: "1-4",
        field: "Purpose of Processing Personal Data",
        oldValue: "To determine if the couple is eligible to marry",
        newValue: "To determine if the couple is eligible to marry and verify their identity",
        status: "needs-answer",
      },
    ],
  },
  {
    id: "2",
    county: "Davis County",
    state: "Utah",
    date: "2025-06-14",
    transaction: "Record/register marriages - Record marriage",
    changes: [
      {
        id: "2-1",
        field: "Related Records",
        oldValue: "Couple's names; the date and place of marriage",
        newValue: "Couple's names; the date and place of marriage; officiant license number",
        status: "approved",
      },
      {
        id: "2-2",
        field: "Retention Period for Personal Data",
        oldValue: "Retain permanently",
        newValue: "Retain permanently; archive after 5 years",
        status: "flagged",
      },
      {
        id: "2-3",
        field: "Value of the Records",
        oldValue: "Administrative",
        newValue: "Administrative, Historical, Legal",
        status: "needs-answer",
      },
    ],
  },
  {
    id: "3",
    county: "Weber County",
    state: "Utah",
    date: "2025-06-13",
    transaction: "Issue marriage licenses - Review couple's identity documents",
    changes: [
      {
        id: "3-1",
        field: "Primary Duties",
        oldValue: "Review couple's identity documents",
        newValue: "Review couple's identity documents and verify authenticity through state database",
        status: "flagged",
      },
      {
        id: "3-2",
        field: "Use of Personal Data",
        oldValue: "The clerk reviews the couple's identity documents and returns them to the couple",
        newValue: "The clerk reviews the couple's identity documents, verifies authenticity electronically, and returns them to the couple",
        status: "approved",
      },
      {
        id: "3-3",
        field: "Statutory Authorization",
        oldValue: "Utah Code § 81-2-303",
        newValue: "Utah Code § 81-2-303, § 81-2-304",
        status: "needs-answer",
      },
    ],
  },
]

function UpdatesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Recent Updates</h2>
        <p className="text-xs text-muted-foreground mt-1">Field-level changes to governance models across counties</p>
      </div>

      <div className="space-y-4">
        {UPDATES.map((update) => (
          <div key={update.id} className="rounded-lg border p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">
                  {update.county}, {update.state}
                </p>
                <p className="text-xs text-muted-foreground">{update.date}</p>
              </div>
              <p className="text-xs text-muted-foreground">{update.transaction}</p>
            </div>

            <div className="space-y-3 border-t pt-3">
              {update.changes.map((change) => (
                <div key={change.id} className="space-y-2 pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">{change.field}</p>
                  </div>
                  <div className="space-y-1 pl-3 border-l-2 border-muted-foreground/20">
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through">{change.oldValue}</span>
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {change.newValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
