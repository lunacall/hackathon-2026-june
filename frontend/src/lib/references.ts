export type Reference = {
  state: string
  category: string
  governmentUnit: string
  name: string
  url: string
  agents: string[]
}

export const AGENT_LABELS: Record<string, string> = {
  core_functions: "Core Fn.",
  primary_duties: "Duties",
  transactions: "Trans.",
  personal_data: "Pers. Data",
  retention: "Retention",
}

export const AGENT_COLORS: Record<string, string> = {
  core_functions: "bg-blue-100 text-blue-700",
  primary_duties: "bg-indigo-100 text-indigo-700",
  transactions: "bg-violet-100 text-violet-700",
  personal_data: "bg-rose-100 text-rose-700",
  retention: "bg-amber-100 text-amber-700",
}

export const REFERENCES: Reference[] = [
  // Alpine School District — Governance
  {
    state: "UT",
    category: "Governance",
    governmentUnit: "Alpine School District",
    name: "About ASD — Core Functions, District Purpose & Governance Structure",
    url: "https://www.alpineschools.org/page/about/",
    agents: ["core_functions", "primary_duties"],
  },
  {
    state: "UT",
    category: "Governance",
    governmentUnit: "Alpine School District",
    name: "1000 Administration — Administrative Offices & Operational Duties",
    url: "https://www.alpineschools.org/apps/pages/index.jsp?dir=1000+Administration",
    agents: ["core_functions", "primary_duties", "transactions"],
  },
  {
    state: "UT",
    category: "Governance",
    governmentUnit: "Alpine School District",
    name: "Policy 1230 — Superintendent's Duties & Authority for Processing Decisions",
    url: "https://alpineschool.org/pdf/policies/1000%20Administration/1230%20SUPERINTENDENT_S%20DUTIES.pdf",
    agents: ["primary_duties"],
  },
  {
    state: "UT",
    category: "Governance",
    governmentUnit: "Alpine School District",
    name: "8000 Operations — Master Policy System (All Operational Rules & Structure)",
    url: "https://alpineschool.org/m/pages/index.jsp?dir=8000+Operations",
    agents: ["core_functions", "primary_duties", "transactions"],
  },
  {
    state: "UT",
    category: "Governance",
    governmentUnit: "Alpine School District",
    name: "Board of Education — Decision Authority & Oversight Functions",
    url: "https://www.alpineschools.org/o/asd/page/board",
    agents: ["core_functions"],
  },
  // Alpine School District — Student Records
  {
    state: "UT",
    category: "Student Records",
    governmentUnit: "Alpine School District",
    name: "Policy 8330 — Student Records (Personal Data Types, Use, Privacy & Disclosure)",
    url: "https://alpineschool.org/pdf/policies/8000%20Operations/8330%20STUDENT%20RECORDS.pdf",
    agents: ["personal_data", "transactions"],
  },
  {
    state: "UT",
    category: "Student Records",
    governmentUnit: "Alpine School District",
    name: "Policy 8335 — FERPA (Legal Authority for Processing Student Data)",
    url: "https://alpineschool.org/pdf/policies/8000%20Operations/8335%20FAMILY%20EDUCATIONAL%20RIGHTS_AND_PRIVACY_ACT.pdf",
    agents: ["personal_data"],
  },
  // Alpine School District — Retention
  {
    state: "UT",
    category: "Retention",
    governmentUnit: "Alpine School District",
    name: "Records Retention Schedule — Retention Periods, Destruction Rules, Classification & Responsible Offices",
    url: "https://alpineschools.org/wp-content/uploads/2022/05/Records-Retention-Schedules-rev-05232022.pdf",
    agents: ["retention"],
  },
  // Alpine School District — Legal Authority
  {
    state: "UT",
    category: "Legal Authority",
    governmentUnit: "Alpine School District",
    name: "ASD GRAMA Implementation — How Alpine School District Applies the Law",
    url: "https://www.utah.gov/pmn/files/1113487.pdf",
    agents: ["personal_data", "retention"],
  },
  // Utah County — County Clerk specific
  {
    state: "UT",
    category: "Utah Code",
    governmentUnit: "Utah County",
    name: "Utah Code § 17-20-4 — Duties of County Clerk",
    url: "https://law.justia.com/codes/utah/2024/title-17/chapter-20/section-4/",
    agents: ["core_functions", "primary_duties"],
  },
  {
    state: "UT",
    category: "Legal Authority",
    governmentUnit: "Utah County",
    name: "Utah County Records Management — GRAMA Implementation & Retention Schedules",
    url: "https://drive.google.com/file/d/1Z0zI_JAKG1lYpyPT4Wc9L89WC0KEWIyH/view",
    agents: ["personal_data", "retention"],
  },
  // Statewide — Legal Authority
  {
    state: "UT",
    category: "Legal Authority",
    governmentUnit: "Statewide",
    name: "GRAMA — Government Records Access & Management Act (Public Records Access & Privacy Framework)",
    url: "https://archives.utah.gov/recordsmanagement/grama/",
    agents: ["personal_data", "retention"],
  },
  // Statewide — Utah Code
  {
    state: "UT",
    category: "Utah Code",
    governmentUnit: "Statewide",
    name: "Title 81 Ch. 2 § 303 — Marriage License Requirements",
    url: "https://le.utah.gov/xcode/Title81/Chapter2/81-2-S303.html",
    agents: ["transactions", "personal_data"],
  },
  {
    state: "UT",
    category: "Utah Code",
    governmentUnit: "Statewide",
    name: "Title 26B Ch. 8 § 125 — Vital Records Protection & Access",
    url: "https://le.utah.gov/xcode/Title26B/Chapter8/26B-8-S125.html",
    agents: ["personal_data", "retention"],
  },
  {
    state: "UT",
    category: "Utah Code",
    governmentUnit: "Statewide",
    name: "Title 63G Ch. 2 § 302 — Private Records (GRAMA)",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S302.html",
    agents: ["personal_data", "retention"],
  },
  {
    state: "UT",
    category: "Utah Code",
    governmentUnit: "Statewide",
    name: "Title 63G Ch. 2 § 301 — Public Records Access (GRAMA)",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S301.html",
    agents: ["personal_data", "retention"],
  },
]

export function getReferencesForUnit(governmentUnit: string): Reference[] {
  return REFERENCES.filter(
    (r) =>
      r.governmentUnit === "Statewide" ||
      r.governmentUnit === governmentUnit ||
      governmentUnit.startsWith(r.governmentUnit)
  )
}
