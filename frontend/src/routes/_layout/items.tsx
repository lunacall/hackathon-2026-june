import { createFileRoute } from "@tanstack/react-router"
import { Download, Eye, MessageSquare, RefreshCw, ArrowLeft, ChevronDown, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export const Route = createFileRoute("/_layout/items")({
  component: ModelsPage,
})

type Transaction = {
  id: string
  primaryDuties: string
  transactions: string
  relatedRecords: string
  personalData: string
  useOfPersonalData: string
  purposeOfProcessing: string
  statutoryAuthorization: string
  valueOfRecords: string
  primaryClassification: string
  secondaryClassification: string
  authorityForProcessing: string
  retentionPeriod: string
  retentionDisposition: string
  generalRetentionSchedule: string
  status: "approved" | "pending" | "needs-answer"
}

type CoreFunction = {
  id: string
  name: string
  transactions: Transaction[]
}

type Model = {
  id: string
  governmentUnit: string
  office: string
  coreFunctions: CoreFunction[]
  approved: boolean
  lastUpdate: string
  owner: string
}

type Reference = {
  state: string
  county: string
  name: string
  url: string
  description: string
}

const REFERENCES: Reference[] = [
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 81 Chapter 2 - Section 303",
    url: "https://le.utah.gov/xcode/Title81/Chapter2/81-2-S303.html",
    description: "Establishes requirements for marriage license issuance, including application procedures, eligibility verification, and documentation standards"
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 26B Chapter 8 - Section 125",
    url: "https://le.utah.gov/xcode/Title26B/Chapter8/26B-8-S125.html",
    description: "Governs vital records protection and access, defining what constitutes exempt and public vital records"
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 63G Chapter 2 - Section 302",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S302.html",
    description: "Provides privacy exemptions for sensitive personal data including social security numbers and government identification information"
  },
  {
    state: "Utah",
    county: "Statewide",
    name: "Title 63G Chapter 2 - Section 301",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S301.html",
    description: "Defines public records access rights and establishes procedures for disclosure of government records"
  },
]

// CSV Data from the Marriage License Model
const MODELS: Model[] = [
  {
    id: "1",
    governmentUnit: "County",
    office: "Clerk",
    approved: false,
    lastUpdate: "2024-06-15",
    owner: "Data Governance Team",
    coreFunctions: [
      {
        id: "cf-1",
        name: "Issue marriage licenses",
        transactions: [
          {
            id: "1-1",
            primaryDuties: "Issue marriage licenses",
            transactions: "Process application and payment",
            relatedRecords: "Application for License to Marry and receipt of payment",
            personalData: "The couple's full names including their maiden or bachelor name, social security number, current address, date and place of birth including the town or city, county, state or country if possible; the names of their parents including the maiden name of the mother; the parents' birthplaces including the town or city, county, state or country, if possible",
            useOfPersonalData: "The couple completes an Application for License to Marry and submits it to the clerk, the couple attests they may lawfully be married, and pays the license fee",
            purposeOfProcessing: "To determine if the couple is eligible to marry",
            statutoryAuthorization: "Utah Code § 81-2-303",
            valueOfRecords: "Historical, Administrative",
            primaryClassification: "Exempt, Utah Code § 26B-8-125, a vital record is only open for inspection in compliance with this statute and DHHS rules",
            secondaryClassification: "Exempt, Utah Code § 81-2-303(4), social security numbers may not be recorded on the marriage license but may be provided to DHHS or ORS who may use it for the administration of child support services",
            authorityForProcessing: "",
            retentionPeriod: "Retain permanently",
            retentionDisposition: "",
            generalRetentionSchedule: "Vital Records GRS-285",
            status: "pending"
          },
          {
            id: "1-2",
            primaryDuties: "Issue marriage licenses",
            transactions: "Review couple's identity documents",
            relatedRecords: "Couple's identity documents (passport, driver license, state identification card, birth certificate)",
            personalData: "The couple's name, nationality, date of birth, place of birth, passport number, driver license number, identification card number, and name of parents",
            useOfPersonalData: "The clerk reviews the couple's identity documents and returns them to the couple",
            purposeOfProcessing: "To verify the couple's identity and age",
            statutoryAuthorization: "Utah Code § 81-2-303",
            valueOfRecords: "Administrative",
            primaryClassification: "Private Utah Code § 63G-2-302",
            secondaryClassification: "N/A",
            authorityForProcessing: "",
            retentionPeriod: "The identity documents should only be reviewed and should not be collected or retained",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "needs-answer"
          },
          {
            id: "1-3",
            primaryDuties: "Issue marriage licenses",
            transactions: "Review required documents for minor applicants",
            relatedRecords: "Petition and Application for Authorization to Marry and Findings and Order on Petition to Marry; proof of premarital counseling; the minor's certified birth certificate, report of a birth abroad, certificate of naturalization, certificate of citizenship, passport, driver's license, or state identification card; a certified adoption decree or court order establishing custody or guardianship of the minor; signed consent of the minor's parent or legal guardian",
            personalData: "Minor's name, nationality, date of birth, place of birth, passport number, driver license number, identification card number, government employee identification number, and status as a member of the military; name of the parent or guardian",
            useOfPersonalData: "The minor files an action in juvenile court to get permission to marry from a judge, completes premarital counseling if required, and submits the additional application for a minor to marry to the clerk; the clerk reviews the application, the court order, and the minor's identity documents; the clerk witnesses the parents' consent to the marriage and returns the minor's identity documents",
            purposeOfProcessing: "To verify the minor's legal name, identity, and birth date; determine the legal relationship between the minor and the minor's parent or legal guardian; and prove the parent or legal guardian has the authority to consent to the marriage of the minor",
            statutoryAuthorization: "Utah Code § 81-2-304",
            valueOfRecords: "Administrative",
            primaryClassification: "Private Utah Code § 63G-2-302",
            secondaryClassification: "N/A",
            authorityForProcessing: "",
            retentionPeriod: "The additional application for a minor to marry should be retained permanently, the rest of the documents should only be reviewed and should not be collected or retained",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "pending"
          },
          {
            id: "1-4",
            primaryDuties: "Issue marriage licenses",
            transactions: "Issue or deny marriage license",
            relatedRecords: "Marriage license (may be combined with the marriage certificate), and any correspondence about a denial",
            personalData: "The couple's full names, residence, age and place of birth; name of the county clerk",
            useOfPersonalData: "After reviewing the application and all of the couple's supporting documentation, the clerk determines whether the couple is or is not eligible to marry; if the application is approved the clerk signs the marriage license and provides it to the couple; if the application is denied the couple is notified that their application was denied",
            purposeOfProcessing: "To prove the couple is or is not authorized to marry",
            statutoryAuthorization: "Utah Code § 81-2-303",
            valueOfRecords: "Historical, Administrative",
            primaryClassification: "Exempt, Utah Code § 26B-8-125, a vital record is only open for inspection in compliance with this statute and DHHS rules",
            secondaryClassification: "N/A",
            authorityForProcessing: "",
            retentionPeriod: "The marriage license should be retained permanently, any documentation related to a denial should be retained for 1 year and then destroyed",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "pending"
          }
        ]
      },
      {
        id: "cf-2",
        name: "Record/register marriages",
        transactions: [
          {
            id: "1-5",
            primaryDuties: "Record/register marriages",
            transactions: "Certify marriage",
            relatedRecords: "Marriage certificate (may be combined with the marriage license)",
            personalData: "Couple's names, place of birth, current residence, and age; signature of the county clerk; names of officiant and witnesses; and date and place of marriage",
            useOfPersonalData: "After the wedding, the married couple, officiant, and witnesses sign the marriage certificate; the officiant returns the marriage license to the clerk, the clerk issues an official certificate of marriage to the couple",
            purposeOfProcessing: "To prove the couple is lawfully married",
            statutoryAuthorization: "Utah Code § 81-2-305",
            valueOfRecords: "Historical, Administrative",
            primaryClassification: "Exempt, Utah Code § 26B-8-125, the marriage certificate in the possession of the county clerk is a vital record",
            secondaryClassification: "Public, Utah Code § 63G-2-301, once a marriage certificate is issued to the couple they may disclose it as they wish",
            authorityForProcessing: "",
            retentionPeriod: "Retain permanently",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "pending"
          },
          {
            id: "1-6",
            primaryDuties: "Record/register marriages",
            transactions: "Record marriage",
            relatedRecords: "Marriage record book or index",
            personalData: "Couple's names; the date and place of marriage",
            useOfPersonalData: "The clerk documents the marriage in the marriage index/record book",
            purposeOfProcessing: "To preserve the official record of marriage",
            statutoryAuthorization: "Utah Code § 81-2-305",
            valueOfRecords: "Historical",
            primaryClassification: "Public, Utah Code § 63G-2-301, may be made available to the public as provided by Utah Code § 63G-2-201",
            secondaryClassification: "N/A",
            authorityForProcessing: "",
            retentionPeriod: "Retain permanently",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "pending"
          },
          {
            id: "1-7",
            primaryDuties: "Record/register marriages",
            transactions: "Register marriage",
            relatedRecords: "Application, license, and certificate",
            personalData: "The couple's full names including their maiden or bachelor name, social security number, current address, date and place of birth including the town or city, county, state or country if possible; the names of their parents including the maiden name of the mother; the parents' birthplaces including the town or city, county, state or country, if possible; names of clerk, officiant, and witnesses; and date and place of marriage",
            useOfPersonalData: "The clerk completes and certifies all of the information required by OVRS and transmits it electronically or in writing",
            purposeOfProcessing: "To preserve the vital records",
            statutoryAuthorization: "Utah Code § 81-2-306",
            valueOfRecords: "Historical, Administrative",
            primaryClassification: "Exempt, Utah Code § 26B-8-125, a vital record is only open for inspection in compliance with this statute and DHHS rules",
            secondaryClassification: "N/A",
            authorityForProcessing: "",
            retentionPeriod: "Retain permanently",
            retentionDisposition: "",
            generalRetentionSchedule: "",
            status: "pending"
          }
        ]
      }
    ]
  }
]

function ModelsPage() {
  const [filteredGovernment, setFilteredGovernment] = useState("")
  const [filteredOffice, setFilteredOffice] = useState("")
  const [filteredFunction, setFilteredFunction] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const filtered = MODELS.filter(
    (m) =>
      (!filteredGovernment || m.governmentUnit.toLowerCase().includes(filteredGovernment.toLowerCase())) &&
      (!filteredOffice || m.office.toLowerCase().includes(filteredOffice.toLowerCase())) &&
      (!filteredFunction || m.coreFunctions.some(cf => cf.name.toLowerCase().includes(filteredFunction.toLowerCase())))
  )

  if (showDetail && selectedModel) {
    return <ModelDetailView model={selectedModel} onBack={() => setShowDetail(false)} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Data Governance Models</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input
          placeholder="Filter by government unit..."
          value={filteredGovernment}
          onChange={(e) => setFilteredGovernment(e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          placeholder="Filter by office..."
          value={filteredOffice}
          onChange={(e) => setFilteredOffice(e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          placeholder="Filter by function..."
          value={filteredFunction}
          onChange={(e) => setFilteredFunction(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Government Unit</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Office</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Core Functions</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Approved</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((model) => (
              <tr key={model.id} className="hover:bg-muted/20">
                <td className="px-4 py-2.5 text-sm text-foreground">{model.governmentUnit}</td>
                <td className="px-4 py-2.5 text-sm text-foreground">{model.office}</td>
                <td className="px-4 py-2.5 text-sm text-foreground">
                  <div className="space-y-1">
                    {model.coreFunctions.map((cf) => (
                      <div key={cf.id} className="text-xs">
                        {cf.name} ({cf.transactions.length})
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-[11px] font-medium px-2 py-1 rounded ${model.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {model.approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setSelectedModel(model)
                        setShowNotes(true)
                      }}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setSelectedModel(model)
                        setShowDetail(true)
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={showNotes} onOpenChange={setShowNotes}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Agent Notes</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <p className="text-xs text-muted-foreground">Agents working together on this model...</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ModelDetailView({ model, onBack }: { model: Model; onBack: () => void }) {
  const [expandedCoreFunction, setExpandedCoreFunction] = useState<string | null>(null)
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [approvedFields, setApprovedFields] = useState<Set<string>>(new Set())
  const [modelApproved, setModelApproved] = useState(model.approved)

  const handleApproveField = (transactionId: string, fieldKey: string) => {
    const fieldId = `${transactionId}-${fieldKey}`
    const newApproved = new Set(approvedFields)
    if (newApproved.has(fieldId)) {
      newApproved.delete(fieldId)
    } else {
      newApproved.add(fieldId)
    }
    setApprovedFields(newApproved)
  }

  const getReferencesForField = (text: string) => {
    const textLower = text.toLowerCase()
    return REFERENCES.filter(() => (
      textLower.includes("81-2-303") || textLower.includes("81-2-304") ||
      textLower.includes("81-2-305") || textLower.includes("81-2-306") ||
      textLower.includes("26b-8-125") || textLower.includes("63g-2-302") ||
      textLower.includes("63g-2-301")
    ))
  }

  const fieldLabels: Record<string, string> = {
    transactions: "Transaction",
    relatedRecords: "Related Records",
    personalData: "Personal Data in the Records",
    useOfPersonalData: "Use of Personal Data",
    purposeOfProcessing: "Purpose of Processing Personal Data",
    statutoryAuthorization: "Statutory Authorization",
    valueOfRecords: "Value of the Records",
    primaryClassification: "Primary Classification",
    secondaryClassification: "Secondary Classification",
    authorityForProcessing: "Authority for Processing Personal Data",
    retentionPeriod: "Retention Period for Personal Data",
    retentionDisposition: "Retention & Disposition",
    generalRetentionSchedule: "General Retention Schedule"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
        <h1 className="text-lg font-semibold">{model.office} - Marriage Licenses</h1>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            Government Unit: {model.governmentUnit}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Core Functions: {model.coreFunctions.length}
          </Badge>
          <Badge className={`text-xs gap-1 ${modelApproved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            {modelApproved && <CheckCircle2 className="h-3 w-3" />}
            {modelApproved ? "Approved" : "Pending"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Export
          </Button>
          <Button
            size="sm"
            className={`h-7 text-xs ${modelApproved ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"} text-white`}
            onClick={() => setModelApproved(!modelApproved)}
          >
            {modelApproved ? "Approved" : "Approve"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {model.coreFunctions.map((coreFunction) => (
          <div key={coreFunction.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedCoreFunction(expandedCoreFunction === coreFunction.id ? null : coreFunction.id)}
              className="w-full px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between gap-3 bg-muted/20"
            >
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold">{coreFunction.name}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {coreFunction.transactions.length}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  expandedCoreFunction === coreFunction.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCoreFunction === coreFunction.id && (
              <div className="space-y-2 border-t p-4 bg-white">
                {coreFunction.transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg overflow-hidden bg-muted/5">
                    <button
                      onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                      className="w-full px-4 py-3 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-medium">
                          {coreFunction.name}: {transaction.transactions}
                        </h4>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedTransaction === transaction.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedTransaction === transaction.id && (
                      <div className="space-y-4 border-t p-4 bg-white">
                        {Object.entries(transaction)
                          .filter(([k]) => !["id", "primaryDuties", "transactions", "status"].includes(k))
                          .map(([key, value]) => {
                            const fieldId = `${transaction.id}-${key}`
                            const isApproved = approvedFields.has(fieldId)
                            const isBlank = !value || value.trim() === ""
                            const fieldStatus = isBlank ? "needs-answer" : isApproved ? "approved" : "pending"
                            const fieldLabel = fieldLabels[key] || key

                            return (
                              <div key={key} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-semibold">{fieldLabel}</h4>
                                  <Badge
                                    className={`text-[10px] ${
                                      fieldStatus === "approved" ? "bg-green-100 text-green-700" :
                                      fieldStatus === "needs-answer" ? "bg-red-100 text-red-700" :
                                      "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {fieldStatus === "approved" ? "Approved" : fieldStatus === "needs-answer" ? "Needs Answer" : "Pending"}
                                  </Badge>
                                </div>

                                {editingField === fieldId ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="w-full h-20 p-2 border rounded text-xs"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" className="h-7 text-xs" onClick={() => setEditingField(null)}>Save</Button>
                                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingField(null)}>Cancel</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-muted-foreground space-y-2 mb-3">
                                    <p>{value || "(empty)"}</p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-muted-foreground mb-2">Relevant References:</div>
                                  <div className="text-xs space-y-2 mb-3 pl-2 border-l-2 border-muted-foreground/20">
                                    {getReferencesForField(String(value)).length > 0 ? (
                                      getReferencesForField(String(value)).map((ref, idx) => (
                                        <div key={idx} className="space-y-1">
                                          <p className="font-medium text-foreground">{ref.name}</p>
                                          <p className="text-muted-foreground">{ref.description}</p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-muted-foreground italic">No specific references found</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => { setEditingField(fieldId); setEditValue(String(value)) }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApproveField(transaction.id, key)}
                                  >
                                    {isApproved ? "Approved" : "Approve"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => { /* Regenerate answer logic */ }}
                                  >
                                    Regenerate
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}