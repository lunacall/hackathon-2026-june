import { createFileRoute } from "@tanstack/react-router"
import { Download, Eye, MessageSquare, RefreshCw, ArrowLeft, ChevronDown, CheckCircle2, Loader2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import { getReferencesForUnit } from "@/lib/references"
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
  codes: string[]
}

const REFERENCES: Reference[] = [
  {
    state: "Utah", county: "Statewide",
    name: "Title 20A Chapter 2 - Voter Registration",
    url: "https://le.utah.gov/xcode/Title20A/Chapter2/20A-2.html",
    description: "Governs voter registration requirements, processes, and maintenance of accurate voter rolls in Utah",
    codes: ["20a-2", "20a chapter 2", "chapter 2 - election code", "chapter 2 - uniform election"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 20A Chapter 9 - Candidate Qualifications",
    url: "https://le.utah.gov/xcode/Title20A/Chapter9/20A-9.html",
    description: "Establishes candidate filing requirements, eligibility criteria, and nomination procedures for public office",
    codes: ["20a-9", "20a chapter 9", "chapter 9"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 20A Chapter 3 - Absentee Voting",
    url: "https://le.utah.gov/xcode/Title20A/Chapter3/20A-3.html",
    description: "Outlines procedures for absentee ballot requests, distribution, verification, and counting",
    codes: ["20a-3", "20a chapter 3", "chapter 3"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 20A Chapter 4 - Counting Ballots",
    url: "https://le.utah.gov/xcode/Title20A/Chapter4/20A-4.html",
    description: "Establishes rules for tabulating votes and certifying election results",
    codes: ["20a-4", "20a chapter 4"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 20A Chapter 11 - Campaign Finance",
    url: "https://le.utah.gov/xcode/Title20A/Chapter11/20A-11.html",
    description: "Governs campaign finance reporting requirements for candidates and political committees",
    codes: ["20a-11", "20a chapter 11"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 63G Chapter 2 - Section 301 (GRAMA Public Records)",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S301.html",
    description: "Defines public records access rights and establishes procedures for disclosure of government records",
    codes: ["63g-2-301", "63g-2 section 301"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 63G Chapter 2 - Section 302 (Private Records)",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S302.html",
    description: "Provides privacy protections for sensitive personal data including social security numbers and government identification",
    codes: ["63g-2-302", "63g-2 section 302", "63g-2-302(1)"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 63G Chapter 2 - Section 305 (Protected Records)",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S305.html",
    description: "Lists protected records categories exempt from public disclosure under GRAMA",
    codes: ["63g-2-305", "63g-2 section 305", "63g-2-305("]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 17 Chapter 21 - County Recorder",
    url: "https://le.utah.gov/xcode/Title17/Chapter21/17-21.html",
    description: "Defines duties of county recorders including recording deeds, property records, and official documents",
    codes: ["17-21", "title 17", "chapter 21"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 57 Chapter 3 - Recording of Documents",
    url: "https://le.utah.gov/xcode/Title57/Chapter3/57-3.html",
    description: "Governs the recording of real estate deeds, liens, mortgages, and other property documents",
    codes: ["57-3", "title 57"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 26 Chapter 2 - Vital Statistics Act",
    url: "https://le.utah.gov/xcode/Title26/Chapter2/26-2.html",
    description: "Governs registration and maintenance of birth, death, and marriage vital records in Utah",
    codes: ["26-2", "vital statistics", "26b-8"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 13 Chapter 2 - Business Licensing Act",
    url: "https://le.utah.gov/xcode/Title13/Chapter2/13-2.html",
    description: "Authorizes counties to issue business licenses and establishes application and renewal procedures",
    codes: ["13-2", "business license", "title 13"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 52 Chapter 4 - Open and Public Meetings Act",
    url: "https://le.utah.gov/xcode/Title52/Chapter4/52-4.html",
    description: "Requires government bodies to hold open meetings and maintain public records of agendas and minutes",
    codes: ["52-4", "open meetings", "public meetings"]
  },
  {
    state: "Utah", county: "Statewide",
    name: "Title 81 Chapter 2 - Marriage Licenses",
    url: "https://le.utah.gov/xcode/Title81/Chapter2/81-2.html",
    description: "Establishes requirements for marriage licenses, registration, and vital records related to marriages",
    codes: ["81-2", "title 81", "marriage license"]
  },
]

// Fetch CSV data from API and parse it (with fallback to embedded CSV)
async function fetchModelsFromAPI(): Promise<Model[]> {
  try {
    const response = await fetch('/models.csv')
    if (response.ok) {
      const csv = await response.text()
      return parseCSV(csv)
    }
  } catch (e) {
    // fall through to embedded data
  }
  return parseCSVFallback()
}

// Fallback CSV data for development
const CSV_DATA = `Government Unit,Office,Core Functions,Primary Duties,Transactions,Related Records,Personal Data in the Records,Use of Personal Data,Purpose of Processing Personal Data,Statutory Authorization,Value of the Records,Primary Classification,Secondary Classification,Retention & Disposition,General Retention Schedule
"Utah County, Utah",Clerk,Elections administration,Register voters,Register voter,Voter registration form and supporting documents,"Name, address, date of birth, driver's license number, social security number","Collect, store, update, verify, and maintain voter registration information",To facilitate the voting process and ensure accurate voter rolls,"Utah Code Annotated, Title 20A, Chapter 2 - Election Code","Administrative value for conducting elections, legal value for verifying voter eligibility, historical value for tracking voter participation",protected (Utah Code 63G-2-305(12)),private (Utah Code 63G-2-302(1)),"6 years after the date of the election to which the voter registration form relates, then destroy (Utah State Archives RDA 408)",RDA 408 - Elections Records
"Utah County, Utah",Clerk,Elections administration,Register voters,Update voter registration information,Voter registration form and supporting documents,"Name, address, date of birth, Social Security number, driver's license number, citizenship status","Collect, store, update, verify, share with other government agencies for voter registration purposes",To maintain accurate and up-to-date voter registration records,Utah Code § 20A-2-103,Legal and administrative value for ensuring fair and accurate elections,protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(g),"Retain for 22 months, then destroy - Utah General Schedule 1-SL",1-SL
"Utah County, Utah",Clerk,Elections administration,Register voters,Verify voter eligibility,Verification records and eligibility documentation,"Name, address, date of birth, citizenship status, party affiliation, voting history","Collecting, storing, updating, sharing with other government entities for verification purposes",To determine voter eligibility and maintain accurate voter registration records,"Utah Code Annotated Title 20A, Chapter 2 - Uniform Election Code","Critical for ensuring fair and accurate elections, maintaining public trust in the electoral process, and complying with legal requirements",protected (Utah Code 63G-2-305(2)),private (Utah Code 63G-2-302(1)),"Retain for 22 months after the election, then destroy (Utah State Archives Election Records Retention Schedule)",Election Records Retention Schedule
"Utah County, Utah",Clerk,Elections administration,Register voters,Issue voter ID card,Voter ID card issuance records,"Name, address, date of birth, contact information, voter registration information","Collecting, storing, updating, verifying, and issuing voter ID cards",To maintain accurate voter registration records and issue voter ID cards for eligible individuals,"Utah Code § 20A-2-102, Utah Code § 20A-2-202",Administrative and legal value for ensuring election integrity and voter participation,protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(a),"Retain for 2 years, then destroy - Utah General Schedule RDA 2435-001",RDA 2435-001
"Utah County, Utah",Clerk,Elections administration,Register voters,Process absentee ballot requests,Absentee ballot request forms and processing logs,"Name, address, date of birth, contact information, party affiliation","Collect, store, update, and maintain voter registration information; verify voter eligibility; process absentee ballot requests",To facilitate voter registration and absentee voting for eligible individuals,"Utah Code § 20A-2-104, Utah Code § 20A-3-102","Administrative value for conducting elections, legal value for verifying voter eligibility, historical value for documenting voter participation",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(a),"1 year after the election, then destroy - Utah State Archives General Schedule 1-SL: Elections Records",1-SL
"Utah County, Utah",Clerk,Elections administration,Register voters,Maintain voter registration database,Voter registration database records,"Name, address, date of birth, driver's license number, last four digits of Social Security number, party affiliation","Collect, store, update, verify, and retrieve voter information",To maintain an accurate voter registration database for election administration,"Utah Code § 20A-2-103, Utah Code § 20A-2-104","Critical for ensuring fair and accurate elections, compliance with state and federal laws, historical documentation of voter participation",protected (Utah Code 63G-2-305(42)),private (Utah Code 63G-2-302(1)),"Retain for 22 years, then destroy (Utah State Archives - General Schedule 1-SL)",1-SL
"Utah County, Utah",Clerk,Elections administration,Register voters,Provide voter information and assistance,Communication logs and voter assistance records,"Name, address, date of birth, contact information, voting history","Collect, store, update, and provide access to voter information",To maintain accurate voter registration records and provide voter assistance,"Utah Code Title 20A, Chapter 2 - Election Code","Critical for ensuring fair and accurate elections, maintaining transparency, and meeting legal requirements",protected - Utah Code 63G-2-305(10)(b),private - Utah Code 63G-2-302(1)(d),"4 years after the election, then destroy - Utah State Archives General Schedule for County Clerks",AC17-62
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate filing for office,"Candidate application form, financial disclosure forms, candidate statement","Candidate's name, address, contact information, financial information, employment history, and any other information provided on the candidate application form.","Collecting, storing, reviewing, and verifying the information provided by candidates for compliance with election laws and regulations.","To ensure that candidates meet the eligibility requirements to run for office, to maintain transparency in the election process, and to facilitate fair elections.","Utah Code Section 20A-9-201, which governs the requirements for candidate filings and financial disclosures for election purposes.","The records have legal and administrative value as they document the process of candidate filings, financial disclosures, and the election administration, ensuring compliance with election laws and regulations.",protected (Utah Code 63G-2-305(1)),private (Utah Code 63G-2-302(1)),"4 years after the end of the election, then destroy (Utah State Archives GS 12-2)",GS 12-2 Elections Administration Records
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate withdrawal from election,"Withdrawal form, official notification to election officials","Candidate's name, contact information, signature, and any other information provided on the withdrawal form.","Verification of candidate withdrawal, updating election records, communication with election officials.",To ensure accurate and up-to-date candidate information for the election process.,"Utah Code Title 20A, Chapter 9, Part 4 - Candidate Filing and Withdrawal",Administrative value for maintaining the integrity of the election process and ensuring compliance with election laws.,protected (Utah Code §63G-2-305(10)),private (Utah Code §63G-2-302(1)),"Retain for 2 years after the election, then destroy (Utah State Archives, General Schedule 1-SL)",1-SL
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate registration deadline reminder,"Notification sent to candidates, records of communication","Candidate's name, contact information, party affiliation, and other relevant details provided during registration.",To send a reminder to candidates about the upcoming registration deadline and to maintain records of communication with candidates.,To ensure that candidates are aware of the deadline for filing their candidacy and to facilitate the election administration process.,Utah Code § 20A-9-201 - Duties of county clerk - Election related responsibilities,"The records hold administrative value by documenting compliance with election regulations, ensuring transparency in the candidate registration process, and providing evidence of communication with candidates.",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(b),"3 years after end of election cycle, then destroy - Utah State Archives General Schedule for Clerk of the County Legislative Body, GRAMA: 1-23(1)(a)",1-23
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate ballot access verification,"Verification forms, correspondence with candidates","Candidate names, addresses, contact information, political party affiliation, signatures","Verification of candidate eligibility, communication with candidates, record-keeping",To ensure that only qualified candidates appear on the ballot and to maintain accurate election records,"Utah Code §20A-9-201, Utah Code §20A-9-202","Critical for ensuring fair and transparent elections, compliance with election laws, and historical documentation of candidate filings",protected (Utah Code 63G-2-305(1)(b)),private (Utah Code 63G-2-302(1)),"6 years after the end of the election in which the candidate sought office, then destroy (Utah General Schedule 1-AD-48)",1-AD-48
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate ballot placement,"Ballot layout, candidate order on ballot","Candidate names, contact information, party affiliation, and other identifying details.","Collecting, storing, organizing, and disclosing candidate information for ballot placement.",To facilitate fair and accurate elections by ensuring proper candidate filings and ballot placement.,"Utah Code § 20A-9-201, which outlines the requirements for candidate filings and ballot placement in Utah elections.","The records hold significant administrative and legal value by documenting the process of candidate filings and ballot placement, ensuring transparency and accountability in the election administration.",protected - Utah Code § 63G-2-305(10),private - Utah Code § 63G-2-302(1),"Retain for 22 months after election, then destroy - Utah State Archives GS4-7",GS4-7
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate campaign finance reporting,"Campaign finance reports, receipts, expenditure records","Candidate's name, address, contact information, financial information, and any other details provided in campaign finance reports.","Collecting, storing, analyzing, and disclosing personal data for the purpose of monitoring and regulating campaign finance activities.",To ensure transparency and accountability in the electoral process by tracking and disclosing campaign contributions and expenditures.,"Utah Code Ann. § 20A-11-101 et seq. and § 20A-11-801 et seq., which govern campaign finance reporting requirements for candidates and political committees.","The records hold significant legal and administrative value as they document compliance with campaign finance laws, support transparency in elections, and provide a historical record of financial activities related to political campaigns.",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(n),"4 years after the election, then destroy - Utah State Archives GS12-7",GS12-7
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate eligibility verification,"Verification documents, eligibility criteria checklist","Candidate's name, address, contact information, date of birth, social security number, previous political affiliations, criminal history, financial information.","Verification of candidate eligibility, cross-referencing information with public records, communication with other government agencies.",To ensure that candidates meet the eligibility criteria required by law to run for office.,"Utah Code Title 20A, Chapter 9 - Candidate Qualifications and Requirements for Public Office.","Critical for maintaining the integrity of the electoral process, ensuring compliance with legal requirements, and preserving transparency in government operations.",protected (Utah Code 63G-2-305(1)(f)),private (Utah Code 63G-2-302(1)(d)),"Retain for 2 years after the end of the election year, then destroy (Utah State Archives GS4-1)",GS4-1 Elections Records
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate nomination process,"Nomination forms, eligibility verification records","Name, address, contact information, date of birth, political party affiliation, signature","Collecting, verifying, storing, and disclosing personal data for the purpose of candidate nomination process",To facilitate the candidate nomination process and ensure compliance with election laws and regulations,Utah Code § 20A-9-201,"Critical for ensuring transparency, accountability, and integrity in the election process as well as for historical documentation of candidate filings",protected (Utah Code 63G-2-305(24)),private (Utah Code 63G-2-302(1)),"3 years after the end of the election, then destroy (Utah State Archives GS4-7)",GS4-7 Elections Records
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate petition validation,"Petition forms, validation results, petition signature verification","Candidate's name, address, contact information, signature, and any other information provided on the petition forms.","Reviewing, verifying, and validating the information provided on the candidate petitions.",To ensure that candidates meet the eligibility requirements for filing and appearing on the election ballot.,"Utah Code Title 20A, Chapter 9 - Candidate Qualifications and Nomination Procedures.","The records hold significant legal value as they demonstrate the compliance of candidates with election laws, ensuring the integrity and transparency of the election process.",protected - Utah Code § 63G-2-305(2)(h),private - Utah Code § 63G-2-302(1)(d),"Retain for 2 years after the election, then destroy - Utah State Archives GS4-1",GS4-1
"Utah County, Utah",Clerk,Elections administration,Manage candidate filings,Candidate ballot designation approval,"Ballot designation request forms, approval records","Candidate's name, contact information, party affiliation, and other personal identifiers.","Review, verify, and approve candidate ballot designations.",To ensure that candidate ballot designations comply with election laws and accurately represent the candidate.,Utah Code § 20A-9-101,"Critical for ensuring transparency and accountability in the electoral process, maintaining accurate election results, and preserving the integrity of the democratic system.",protected (Utah Code 63G-2-305(1)(e)),private (Utah Code 63G-2-302(1)(d)),"Retain for 2 years after end of election cycle, then destroy (Utah State Archives GS4-7)",GS4-7
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Receive absentee ballot requests,Absentee ballot request forms,"Name, address, date of birth, contact information, voter registration information","Verify voter eligibility, process absentee ballot requests, communicate with voters","Facilitate absentee voting process, ensure accurate and secure election administration","State election laws, Utah Code Title 20A - Election Code","Critical for ensuring transparency, accountability, and integrity in the election process; historical value for auditing and verification purposes",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1)(b),"Retain for 22 months after the election, then destroy - Utah State Archives General Schedule 1-SL Elections Records",1-SL-002
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Verify voter eligibility for absentee voting,Voter registration records and identification documents,"Voter registration information, identification documents",Verification of voter eligibility for absentee voting,To ensure that only eligible voters are able to vote absentee,"Utah Code § 20A-3-201, Utah Code § 20A-3-302",Administrative and legal value for maintaining election integrity and compliance with voting regulations,protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1),"Retain for 22 months after the election, then destroy - Utah State Archives General Schedule UCA 63G-2-604(1)(b)",Election Records - GS4-1
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Distribute absentee ballots,List of voters requesting absentee ballots and corresponding ballots issued,"Name, address, date of birth, voter registration number, signature","Collect, store, update, and verify voter information for absentee voting purposes",To facilitate the absentee voting process and ensure accurate and secure distribution of absentee ballots,"Utah Code § 20A-3a-202, which outlines the requirements and procedures for absentee voting in Utah","The records hold administrative value for tracking and auditing the absentee voting process, legal value for ensuring compliance with election laws, and historical value for documenting voter participation in elections.",protected - Utah Code 63G-2-305(1)(d),private - Utah Code 63G-2-302(1),"Retain for 22 months after the election, then destroy - Utah State Archives GS4-7",GS4-7
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Receive completed absentee ballots,Received absentee ballots,"Voter's name, address, date of birth, signature, and any other information provided on the absentee ballot envelope that can identify the individual.","Verify voter eligibility, process and count absentee ballots, maintain accurate voter records, and ensure election integrity.",To facilitate absentee voting and ensure that eligible voters can securely cast their vote in elections.,"Utah Code Ann. § 20A-3-301, which governs the administration of absentee voting and the processing of absentee ballots by county clerks.","The received absentee ballots are crucial for ensuring the accuracy and integrity of election results, maintaining transparency in the electoral process, and providing evidence in case of recounts or disputes.",protected - Utah Code 63G-2-305(10)(b),private - Utah Code 63G-2-302(1)(a),"1 year after the election, then destroy - Utah State Archives GS4-7",GS4-7
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Verify and count absentee ballots,Verified absentee ballots and counting records,"Voter names, addresses, signatures, and any other identifying information on absentee ballots",To verify the authenticity of absentee ballots and ensure they are counted accurately,To facilitate the absentee voting process and maintain the integrity of elections,"Utah Code § 20A-3-202, which governs absentee voting procedures","Critical for ensuring transparency and accountability in the electoral process, as well as for auditing and verification purposes",protected - Utah Code 63G-2-305(2)(d),private - Utah Code 63G-2-302(1)(f),"Retain for 22 months, then destroy - Utah General Schedule RDA 2595",RDA 2595
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Resolve absentee ballot discrepancies,Documentation of discrepancies and resolutions,"Voter names, addresses, contact information, voting history, reasons for absentee voting, signature verification, etc.","Review, verify, update, and store personal data to ensure accuracy and legitimacy of absentee ballots.","To facilitate and administer the absentee voting process, ensure the integrity of the election, and provide accurate and secure voting services.","Utah Code Ann. § 20A-3-202, which governs the duties and responsibilities of election officers in the state of Utah.","The records have significant administrative and legal value as they document the resolution of discrepancies in absentee ballots, ensuring the transparency and integrity of the election process.",controlled (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"Retain for 2 years after resolution, then securely destroy (Utah State Archives - General Schedule 1-SL-010)",1-SL-010
"Utah County, Utah",Clerk,Elections administration,Oversee absentee voting,Report absentee voting results,Official absentee voting results and related documentation,"Voter names, addresses, contact information, signatures, and voting history.","Collecting, storing, analyzing, and reporting absentee voting results.",To ensure the accurate and transparent reporting of absentee voting results in elections.,Utah Code § 20A-3-301 - Duties of the county clerk in conducting elections.,"The records have legal and administrative value as they document the official results of absentee voting, ensuring transparency and accountability in the election process.",protected (Utah Code 63G-2-305(1)(a)),private (Utah Code 63G-2-302(1)),"Retain for 22 months after the end of the calendar year in which the election is held, then destroy (Utah State Archives - Election Records)",AC 38-2018
"Utah County, Utah",Clerk,Elections administration,Certify election results,Register voters,Voter registration forms and databases,"Name, address, date of birth, social security number, driver's license number, party affiliation, voting history","Collecting, storing, updating, sharing, verifying",To maintain accurate voter registration records and facilitate participation in elections,"Utah Code Title 20A, Election Code","Administrative value for conducting elections, legal value for verifying voter eligibility, historical value for documenting election outcomes",protected - Utah Code Ann. § 63G-2-305(10)(b),private - Utah Code Ann. § 63G-2-302(1)(d),"3 years after the election, then destroy - Utah State Archives General Schedule 1-SL: Elections Records",1-SL
"Utah County, Utah",Clerk,Elections administration,Certify election results,Process absentee ballots,Absentee ballot requests and processing logs,"Name, address, date of birth, signature, voter registration number","Verify voter eligibility, process absentee ballot requests, update voter records","To accurately and securely administer elections, including absentee voting",Utah Code Title 20A. Election Code,"Critical for ensuring the integrity and transparency of the election process, compliance with election laws, and historical documentation of election results",protected - Utah Code § 63G-2-305(1)(a),private - Utah Code § 63G-2-302(1)(a),"3 years after certification of election results, then destroy - Utah General Schedule 1-SL-005",1-SL-005
"Utah County, Utah",Clerk,Elections administration,Certify election results,Verify voter eligibility,Voter eligibility verification records,"Name, address, date of birth, voter registration number, voting history","Verification of voter eligibility, comparison with voter registration records",To ensure that only eligible voters participate in elections and to maintain the integrity of the electoral process,"Utah Code § 20A-2-102, Utah Code § 20A-2-201","Critical for ensuring fair and accurate election results, maintaining public trust in the electoral process, and demonstrating compliance with legal requirements",protected - Utah Code § 63G-2-305(10),private - Utah Code § 63G-2-302(1),"Retain for 22 months after certification of election results, then destroy","Elections Records, UT-RDA-414"
"Utah County, Utah",Clerk,Elections administration,Certify election results,Count and tabulate votes,Vote count reports and tallies,"Names, addresses, voter registration information","Collect, store, and analyze data for election purposes",To certify election results and ensure accurate vote counting,"Utah Code 20A-4-102, Utah Code 20A-1-201","Critical for maintaining the integrity and transparency of the election process, ensuring accuracy of results, and demonstrating compliance with election laws",controlled (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"Retain for 22 months after certification of the election results, then securely destroy (Utah State Archives GS4-2)",GS4-2 Elections Records
"Utah County, Utah",Clerk,Elections administration,Certify election results,Certify election results,Certification documents and reports,"Voter names, addresses, voter registration numbers, signatures, and other identifying information.","To verify the identity of voters, ensure the accuracy of election results, and maintain election integrity.",To certify election results and declare the official outcome of an election.,State election laws and regulations governing the certification of election results.,"Critical for ensuring transparency and accountability in the electoral process, maintaining public trust in the election system, and preserving the integrity of democratic practices.",protected - Utah Code 63G-2-305(2)(b),private - Utah Code 63G-2-302(1)(f),"Retain for 22 months after certification, then destroy - Utah State Archives General Schedule 1-SL: Elections Records",1-SL
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Process voter registration application,Voter registration application form and supporting documents,"Name, address, date of birth, social security number, driver's license number, citizenship status, party affiliation, contact information","Collect, store, retrieve, update, verify, transmit",To maintain accurate voter registration records and enable eligible individuals to vote in elections,"Utah Code § 20A-2-104, Utah Code § 20A-2-301","Legal and administrative value for ensuring fair and accurate elections, historical value for documenting voter participation",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1),"6 years after the date of the election to which the records relate, then destroy - Utah General Schedule RDA 2019-003",RDA 2019-003
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Verify voter eligibility,Verification records and documentation,"Name, address, date of birth, social security number, driver's license number, citizenship status","Collect, store, verify, update, maintain, and share personal data for voter registration purposes",To process voter registration applications and verify voter eligibility in order to maintain accurate voter rolls,"Utah Code Title 20A, Chapter 2 - Election Code","Critical for ensuring the integrity of the electoral process, maintaining accurate voter rolls, and upholding the right to vote",protected - Utah Code § 63G-2-305(1)(a),private - Utah Code § 63G-2-302(1),1 year after the election to which the records relate - Destroy,Utah State Archives GS1-AD-21
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Update voter information,Updated voter registration records,"Name, address, date of birth, Social Security number, driver's license number, party affiliation","Collect, store, update, verify, and maintain voter registration information",To facilitate voter registration and ensure accurate voter rolls,"Utah Code Title 20A, Election Code",Legal and administrative value for ensuring fair and accurate elections,protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"Retain for 2 years after the election, then destroy (Utah State Archives GS4-5)",GS4-5
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Issue voter registration card,Voter registration card issuance records,"Name, address, date of birth, social security number, driver's license number, citizenship status, party affiliation","Collecting, storing, verifying, updating, and sharing personal data for voter registration purposes",To maintain accurate voter registration records and issue voter registration cards to eligible individuals,"Utah Code Title 20A, Chapter 2 - Election Code","Administrative value for ensuring fair and accurate elections, legal value for compliance with election laws, historical value for documenting voter registration activities",protected - Utah Code 63G-2-305(10),private - Utah Code 63G-2-302(1),"4 years after superseded or obsolete, then destroy - Utah State Archives GS4-7",GS4-7 Voter Registration Records
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Maintain voter registration database,Database of registered voters,"Name, address, date of birth, social security number, driver's license number, citizenship status, party affiliation, voting history","Collect, store, update, verify, and share personal data for voter registration purposes",To facilitate the voter registration process and maintain an accurate voter registration database for elections,"Utah Code § 20A-2-104, Utah Code § 20A-2-202","Administrative value for conducting fair and accurate elections, legal value for compliance with election laws and regulations, historical value for documenting voter participation over time",protected - Utah Code Section 63G-2-305(10),private - Utah Code Section 63G-2-302(1),Maintain permanently in office or transfer to State Archives after 10 years.,GSC-1.2.007
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Respond to voter inquiries,Correspondence and communication records,"Information provided on voter registration applications such as name, address, date of birth, and Social Security number.","Collecting, verifying, updating, and maintaining voter registration information.",To facilitate the voter registration process and ensure accurate voter rolls.,State election laws and regulations governing voter registration processes.,"Critical for ensuring the integrity of the electoral process, maintaining accurate voter rolls, and responding to voter inquiries. Also, helps in ensuring compliance with legal requirements related to voter registration.",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1),"Retain for 2 years, then securely destroy - Utah State Archives General Schedule 1-SL",1-SL
"Utah County, Utah",Clerk,Voter registration,Process voter registration applications,Assist with absentee voting,Absentee voting records and documentation,"Name, address, date of birth, social security number, driver's license number, signature","Collect, store, verify, update, share with other government agencies",To maintain accurate voter registration records and facilitate the voting process,Utah Code Ann. § 20A-2-101 et seq. - Election Code,"Administrative value for conducting elections, legal value for verifying voter eligibility, historical value for documenting voting trends",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"6 years after the end of the election in which the voter last voted, then destroy (Utah State Archives - General Retention Schedule - 1-5-201)",1-5-201
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Assist voter with registration form completion,Completed voter registration form,"Name, address, date of birth, contact information, party affiliation, citizenship status, signature","Collecting, storing, updating, verifying, and sharing personal data for voter registration purposes",To facilitate the voter registration process and maintain accurate voter rolls,"Utah Code Annotated, Title 20A, Chapter 2 - Uniform Election Code",The records hold significant administrative and legal value for ensuring the integrity of the electoral process and preserving citizens' voting rights.,protected - Utah Code Section 63G-2-305(18),private - Utah Code Section 63G-2-302(1),"3 years after the election, then destroy - Utah State Archives General Schedule 1-SL-100",1-SL-100
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Verify voter eligibility,Verification documents and records,"Name, address, date of birth, Social Security number, driver's license number, citizenship status","Collect, store, update, verify, and share personal data for voter registration purposes",To maintain accurate and up-to-date voter registration records and ensure only eligible individuals are registered to vote,"Utah Code Title 20A, Chapter 2 - Uniform Election Code",The records have significant legal and administrative value in ensuring the integrity of the electoral process and upholding voter eligibility requirements.,protected - Utah Code § 63G-2-305(10)(a),private - Utah Code § 63G-2-302(1),"Retain for 22 months after the date of the election, then destroy - Utah State Archives GS4-1",GS4 Voter Registration Records
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Update voter information in database,Updated voter registration database entry,"Name, address, date of birth, contact information, political affiliation","Collect, store, update, retrieve, share with election officials",To maintain accurate voter registration records and ensure eligible citizens can vote,"Utah Code § 20A-2-104, Utah Voter Registration Database Act","Critical for election integrity, voting rights, and compliance with state laws",protected (Utah Code 63G-2-305(1)),private (Utah Code 63G-2-302(1)),"3 years after the record was created, then destroy (Utah General Schedule 1-SL)",1-SL
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Provide voter registration information to public,Informational brochures and guides,"Names, addresses, dates of birth, and other identifying information of individuals registering to vote","Collecting, storing, updating, and sharing personal data to maintain accurate voter registration records",To facilitate the voter registration process and ensure eligible individuals can participate in elections,"Utah Code Annotated, Title 20A, Chapter 2 - Election Code","The records have legal and administrative value in ensuring the integrity and accuracy of the voter registration process, as well as supporting election transparency and participation.",protected (Utah Code § 63G-2-305(1)),private (Utah Code § 63G-2-302(1)),"Retain for 3 years after last action, then destroy (Utah State Archives GS 12056)",GS 12056 - General Schedule for Local Governments
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Assist voter with online registration process,Online registration submission records,"Name, address, date of birth, contact information, voting history","Collecting, storing, updating, and accessing personal data for voter registration purposes",To facilitate voter registration and ensure accurate voter rolls,"Utah Code § 20A-2-104, which requires county clerks to maintain voter registration records",Administrative value for voter registration management and legal value for ensuring election integrity,protected - Utah Code 63G-2-305(10),private - Utah Code 63G-2-302(1),"Retain for 2 years after last action, then destroy - Utah General Schedule 27-105",27-105
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Process change of address requests for voter registration,Change of address forms and database updates,"Name, address, date of birth, previous address","Updating voter registration records, verifying voter identity",To ensure accurate voter registration information and maintain election integrity,Utah Code § 20A-2-103,Critical for maintaining accurate voter rolls and conducting fair elections,protected (Utah Code 63G-2-305(1)(d)),private (Utah Code 63G-2-302(1)(d)),"2 years after the change is processed, then destroy (Utah General Schedule 25-1)",25-1
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Assist voters with registration status inquiries,Inquiry logs and responses,"Name, address, date of birth, contact information, voter registration status","Collecting, storing, updating, and providing access to voter registration information",To facilitate voter registration inquiries and assist voters with registration status,"Utah Code § 20A-2-102, which mandates the maintenance of accurate voter registration records by county clerks","The records have administrative value in ensuring accurate voter registration information, legal value in compliance with election laws, and historical value for auditing and accountability purposes.",protected - Utah Code 63G-2-305,private - Utah Code 63G-2-302,"4 years after creation, then destroy - Utah State Archives General Schedule 1-SL",1-SL
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Conduct voter registration outreach events,Event attendance records and outreach materials,"Individuals' names, addresses, dates of birth, and other identifying information provided during voter registration.","Collecting, storing, updating, and sharing personal data to facilitate voter registration and outreach efforts.",To maintain accurate voter registration records and assist individuals in registering to vote.,"Utah Code Annotated, Title 20A, Chapter 2 - Election Code, which governs voter registration and outreach activities.","The records have significant administrative value for ensuring electoral integrity, legal value for compliance with election laws, and historical value for documenting voter registration activities in the county.",protected (Utah Code Ann. § 63G-2-305(10)),private (Utah Code Ann. § 63G-2-302(1)),"3 years after the event, then destroy (Utah General Schedule 1-SL-110)",Utah General Schedule 1-SL-110
"Utah County, Utah",Clerk,Voter registration,Assist voters with registration inquiries,Assist voters with absentee ballot registration,Absentee ballot registration forms and processing records,"Name, address, date of birth, contact information, signature","Collecting, storing, reviewing, updating, verifying",To facilitate voter registration and absentee ballot processing,"Utah Code § 20A-2-102, Utah Code § 20A-3-101",Legal and administrative value for ensuring accurate voter registration and absentee ballot processing,protected - Utah Code 63G-2-305(10),private - Utah Code 63G-2-302(1)(b),"Retain for 1 year after election, then securely destroy - Utah State Archives General Schedule 1-SL (Elections Records)",1-SL
"Utah County, Utah",Clerk,Voter registration,Ensure compliance with voter registration laws and regulations,Process new voter registration application,New voter registration form and supporting identification documents,"Name, address, date of birth, social security number, driver's license number, and other identifying information of the individual applying for voter registration.","Verification of the applicant's eligibility to vote, entry into voter registration database, and potential auditing or investigation of voter registration processes.",To facilitate the voter registration process and ensure that only eligible individuals are registered to vote in compliance with state laws and regulations.,Utah Code Ann. § 20A-2 (Election Code) and other relevant state and federal laws governing voter registration processes.,The records have significant administrative and legal value as they document the process of voter registration and help ensure the integrity of the electoral system by maintaining accurate and up-to-date voter rolls.,protected - Utah Code Ann. § 63G-2-305(10),private - Utah Code Ann. § 63G-2-302(1),"Retain for 22 months after the date of the election to which the registration applies, then destroy - Utah State Archives, Local Government General Schedule (LGGS) #31",LGGS #31
"Utah County, Utah",Clerk,Voter registration,Ensure compliance with voter registration laws and regulations,Update voter registration information,Updated voter registration form and any supporting documents for changes,"Name, address, date of birth, social security number, driver's license number, other identification numbers, party affiliation, voting history","Collect, store, update, verify, and maintain voter registration information",To facilitate the voter registration process and ensure accurate and up-to-date voter rolls,"Utah Code Annotated, Title 20A, Chapter 2 - Election Code","Critical for the integrity of the electoral process, compliance with state laws, and ensuring eligible voters can participate in elections",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"Maintain for 22 months after the election, then destroy (Utah Code 20A-2-104)",UT-RM-2-2
"Utah County, Utah",Clerk,Voter registration,Ensure compliance with voter registration laws and regulations,Verify voter eligibility,Verification records and documentation,"Name, address, date of birth, Social Security number, driver's license number, citizenship status","Collect, store, update, verify, and share personal data for voter registration purposes",To maintain accurate and up-to-date voter registration records and ensure only eligible individuals are registered to vote,Utah Code § 20A-2 (Election Code) and other relevant state and federal laws governing voter registration,"The records have significant legal and administrative value in ensuring the integrity and fairness of the electoral process, as well as in providing evidence of compliance with voter registration laws and regulations.",protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1),2 years after the date of the election to which the record relates - Destroy - Utah State Archives General Retention Schedule 1-SL: Elections Records,1-SL
"Utah County, Utah",Clerk,Voter registration,Ensure compliance with voter registration laws and regulations,Process change of address for voter registration,Change of address form and proof of new address,"Name, address, previous address, date of birth, voter registration number","Verify identity, update voter registration records, communicate changes to relevant parties",To ensure accurate voter registration information and compliance with voter registration laws,"Utah Code § 20A-2-104, Utah Code § 20A-2-305",Administrative value for maintaining accurate voter registration records and compliance with legal requirements,protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"1 year after the next election, then destroy (Utah State Archives GS1-AD-1)",GS1-AD-1
"Utah County, Utah",Clerk,Voter registration,Ensure compliance with voter registration laws and regulations,Remove deceased voters from registration list,Deceased voter notification records and removal documentation,"Name, date of birth, address, Social Security number, voter registration number","Identifying deceased voters, updating registration lists, sending notifications",Maintaining accurate voter registration lists and ensuring compliance with laws,"Utah Code Section 20A-2-101 et seq., National Voter Registration Act",Critical for maintaining the integrity of the electoral process and complying with legal requirements,protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"3 years after removal, then destroy (Utah State Archives GS4-7)",GS4-7
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,Record new property deeds,Property deed documents,"Names, addresses, property details of individuals involved in property deeds",Indexing and cataloging for retrieval and reference purposes,To maintain an accurate and organized public record of property ownership,State laws governing public records management and property transactions,Legal and administrative value in establishing property ownership and history,public (controlled) - Utah Code 63G-2-301,personal data - Utah Code 63G-2-302,"7 years after creation, then destroy - Utah State Archives RDA 2520-015",GS 3-8
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,Index birth certificates,Birth certificate records,"Name, date of birth, place of birth, parent's names, gender, race, and other identifying information of the individual named in the birth certificate.",Indexing and cataloging the birth certificates to ensure easy retrieval and access for record keeping purposes.,"To maintain accurate and organized public records of birth certificates for legal, administrative, and historical purposes.","Utah Code § 26-2-22, which mandates the Clerk's office to maintain birth certificate records and ensure their proper indexing.","The birth certificate records have significant legal and administrative value for verifying identities, determining citizenship, and maintaining vital statistics for public health and historical research purposes.",public (Utah Code 63G-2-301),personal data (Utah Code 63G-2-302),Permanent retention (Utah Code 63G-2-204(1)),GRS-0036
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,Catalog marriage licenses,Marriage license documents,"Names, birthdates, addresses, and other identifying information of individuals applying for marriage licenses.",Indexing and cataloging to facilitate easy retrieval and reference of marriage license records.,To maintain accurate and organized public records of marriage licenses issued in Utah County.,"Utah Code, Title 30, Chapter 1, Part 3, specifically Section 30-1-9 which outlines the requirements for recording and indexing marriage licenses.","The records hold significant legal and historical value as they serve as official documentation of marriages within the jurisdiction, aiding in genealogical research, legal proceedings, and administrative purposes.",public (Utah Code 63G-2-301),personal data (Utah Code 63G-2-302),"3 years after license is issued, then destroy (Utah Code 26-2-22)","Municipal Clerks Records, Schedule 2-5"
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,Update property ownership records,Property ownership records,"Property owner's name, address, contact information, and possibly other identifying information.",To accurately update property ownership records in the county's database.,To maintain accurate and up-to-date property ownership information for public access and legal purposes.,Utah Code Section 17-21-14 mandates the County Clerk to maintain property ownership records.,"The property ownership records have significant legal and administrative value for property transactions, taxation, and public information purposes.",public (protected) - Utah Code 63G-2-305(22),personal data - Utah Code 63G-2-302,"Property ownership records must be retained for a minimum of 7 years after the last action, then they can be destroyed.",GRS 1100 - Real Property Records
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,Maintain death certificates database,Death certificate records,"Name, date of birth, date of death, place of death, cause of death, next of kin information","Indexing, cataloging, updating, querying, retrieving, and reporting on death certificate records","To accurately maintain and provide access to death certificate records for legal, genealogical, and public health purposes","Utah Code Title 26, Chapter 2, Section 1 - Duties of County Clerk regarding public records","Legal value for probate and estate settlement, administrative value for public health statistics, historical value for genealogical research",public (Utah Code 63G-2-301(3)),private (Utah Code 63G-2-302(1)),"Retain for 50 years after creation, then transfer to the Utah State Archives for permanent preservation (Utah Code 26-2-22)",GRS-0018
"Utah County, Utah",Clerk,Maintaining public records,Index and catalog public records,File and store court judgments,Court judgment documents,"Names, addresses, social security numbers, case numbers, dates of birth","Indexing, cataloging, filing, storing","To maintain and provide access to public records, ensure accuracy and efficiency in record-keeping","Utah Code, Title 63G, Chapter 2, Government Records Access and Management Act","Legal value for evidentiary purposes, historical value for research and genealogy, administrative value for governmental operations",controlled (Utah Code 63G-2-305(21)),private (Utah Code 63G-2-302(1)),"Retain for 10 years after final action, then destroy (Utah State Courts RDA)",CLERK
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Accepting and filing property deeds,Property deeds and related documents,"Names, addresses, legal descriptions of properties, signatures of property owners, social security numbers, and other identifying information.","Collecting, organizing, storing, retrieving, and disclosing personal data for the purpose of recording property ownership and maintaining public records.","To establish and maintain a public record of property ownership, transfers, and encumbrances for legal and administrative purposes.","State laws governing the recording of property deeds and public records management, such as the Utah Code Title 57 - Real Estate Records.","The property deeds and related documents have significant legal and historical value as they establish ownership rights, property boundaries, and encumbrances, ensuring transparency and accountability in property transactions.",public (protected) - Utah Code § 63G-2-301(3),personal data - Utah Code § 63G-2-302(1),"Property deeds must be retained permanently, and related documents must be retained for 7 years after the property deed is recorded. Destruction must be in accordance with approved disposition schedules.",Permanent - Property Records
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Issuing birth certificates,Birth certificates and related documents,"Name, date of birth, place of birth, parents' names, and any other information included on a birth certificate.","Issuing birth certificates, verifying identity, maintaining accurate records, and responding to record requests.","To establish and verify an individual's identity, citizenship, and family relationships, as well as for legal and administrative purposes.","State laws governing vital records and public records management, such as the Utah Vital Records Act.","Birth certificates have historical value for genealogical research, administrative value for establishing identity and citizenship, legal value for proof of parentage and inheritance rights, and fiscal value for collecting vital statistics and fees.",protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),"Retain for 100 years after birth, then transfer to the Utah State Archives for permanent preservation (Utah State Archives, Birth and Death Records General Retention Schedule)",GRS-1302
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Recording marriage licenses,Marriage licenses and related documents,"Names, addresses, birth dates, and other identifying information of individuals applying for marriage licenses","Recording, indexing, and storing personal data for the purpose of issuing marriage licenses and maintaining public records",To facilitate the legal process of marriage registration and provide proof of marriage for individuals,"Utah Code, Title 30, Chapter 1, Part 2 - Vital Statistics and Records","Legal and historical value as proof of marriage, administrative value for record-keeping and public access, and potential genealogical value",protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),Marriage licenses: Permanent; Related documents: 50 years after marriage license issued,GRS-0407
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Providing access to public records,Public records requests and responses,"Names, addresses, contact information, social security numbers, driver's license numbers, etc. of individuals contained in public records.","Collecting, storing, organizing, maintaining, retrieving, disclosing, and providing access to personal data in public records.","To maintain transparency, facilitate public access to information, support government accountability, and ensure compliance with public records laws.","Government Records Access and Management Act (GRAMA) in Utah, which governs the management of government records and provides guidelines for accessing public records.","The records have historical value for documenting government activities, administrative value for decision-making and accountability, legal value for evidence and compliance, and fiscal value for budgeting and financial oversight.",public (protected) - Utah Code 63G-2-305,personal data (controlled) - Utah Code 63G-2-302,"1 year after creation, then destroy - Utah State Archives General Schedule GRAMA",GRAMA-GENERAL
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Maintaining digital archives of public records,Digital copies of public records,Any information contained in a record that is linked or can be reasonably linked to an identified individual or an identifiable individual.,"Maintaining digital archives of public records, ensuring security and confidentiality.",To provide access to public records while safeguarding the privacy of individuals.,Governmental regulations such as the Utah Government Records Access and Management Act (GRAMA).,"The historical, legal, and administrative value of maintaining accurate public records for transparency and accountability.",protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),Maintain digital archives permanently; may destroy after microfilming or digitizing (Utah General Schedule GRAMA-3),GRAMA-3
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Verifying authenticity of public records,Verification logs and records,"Names, addresses, dates of birth, social security numbers, or any other identifying information of individuals contained in public records.",Verifying the authenticity of public records by cross-referencing with other databases or sources.,To ensure the accuracy and reliability of public records and maintain the trust of the public in the integrity of the records.,"State laws governing public records management and access, such as the Utah Government Records Access and Management Act (GRAMA).","The records have significant legal and historical value, as they serve as a basis for official transactions and provide evidence of government activities and decisions.",protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),Verify with the Utah State Archives for specific retention requirements. Destruction must comply with state regulations.,Check with the Utah State Archives for the applicable general schedule.
"Utah County, Utah",Clerk,Maintaining public records,Ensure the security and confidentiality of public records,Securing physical public records storage,Inventory of physical records storage locations,"Names, addresses, contact information, social security numbers, birth dates, and other identifying information of individuals contained in public records.","Organizing, storing, retrieving, and providing access to public records for official use and public inquiry.","To maintain transparency, accountability, and facilitate access to public information for citizens and government agencies.","Government Records Access and Management Act (GRAMA) in Utah, which governs the management and access to government records.","The records hold historical significance, support administrative functions, ensure legal compliance, and have fiscal importance for government operations and citizen rights.",protected (Utah Code § 63G-2-305),private (Utah Code § 63G-2-302),"5 years, then destroy (Utah State Archives General Schedule - County Clerks Records)",CC-2
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Record new property deeds,Property deeds and related documentation,"Names, addresses, property information, signatures of property owners","Capturing, storing, organizing, updating, and retrieving property deed information",To maintain an accurate and up-to-date record of property ownership within the county,"Utah Code, Title 17, Chapter 21 - County Recorder","Legal value for property ownership, historical value for research and genealogy, administrative value for property transactions","public, Utah Code 63G-2-301","personal, Utah Code 63G-2-302","7 years after property transfer, then destroy, or permanent retention if historical value, Utah State Archives RDA 232",RDA 232 - Real Property Records
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Issue certified copies of public records,Certified copies of public records,"Names, addresses, birthdates, social security numbers, and any other identifying information of individuals contained in public records.","Collecting, storing, retrieving, updating, and disclosing personal data to issue certified copies of public records.","To provide individuals with official copies of public records for legal, personal, or administrative purposes.",Utah Government Records Access and Management Act (GRAMA) and other relevant state and federal laws governing public records management.,"The records have legal value as they serve as official documentation of events, transactions, or decisions. They also have historical value for research and preserving the county's heritage.",public (protected) - Utah Code § 63G-2-301,personal data - Utah Code § 63G-2-302,Permanent - Transfer to State Archives after 10 years,GRS-0102
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Assist public in accessing and retrieving records,Requests for records and retrieval documentation,"Names, addresses, contact information, social security numbers, birth dates, and any other information that can identify an individual.","Organizing, storing, updating, and providing access to personal data as needed for record-keeping purposes.","To maintain accurate and up-to-date public records for transparency, accountability, and accessibility to the public.",Governmental regulations such as the Utah Government Records Access and Management Act (GRAMA) which mandates the maintenance and accessibility of public records.,"The records hold historical significance, support administrative functions, ensure compliance with legal requirements, and have fiscal importance for the county's operations.",public (controlled) - Utah Code 63G-2-301(3)(a),personal data - Utah Code 63G-2-302(1),"Electronic records: 3 years after creation, Physical records: 5 years after creation, then review for historical value; Destruction requires approval from State Archives",GRS 1-201
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Update electronic database with new records,Electronic database entries and updates,"Names, addresses, phone numbers, social security numbers, birth dates, and other identifying information of individuals contained in public records.",To maintain accurate and up-to-date records for public access and government operations.,To provide transparency and access to government records for the public and to support efficient government operations.,"Government Records Access and Management Act (GRAMA) of Utah, Title 63G, Chapter 2, Part 3.","The records have significant historical, administrative, and legal value as they document government activities, decisions, and interactions with the public. They also serve as evidence in legal matters and support accountability and transparency in government operations.",public (Utah Code 63G-2-301),personal data (Utah Code 63G-2-302),"5 years after creation, then review for historical significance; if not historically significant, destroy (Utah State Archives General Schedule GRAMA-1)",GRAMA-1
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Maintain physical filing system,Physical record files and organization,"Names, addresses, contact information, social security numbers, birth dates, and other personal identifiers included in public records.","Organizing, updating, and managing public records to ensure accuracy and accessibility.","To provide transparency and access to government information for the public, fulfill legal requirements, and support administrative functions.","Government Records Access and Management Act (GRAMA) in Utah, which governs the management and access to government records.","The records have legal and historical significance, supporting accountability, transparency, and efficient government operations.",public,personal data,"5 years after creation, then review for destruction",GRS-1.1
"Utah County, Utah",Clerk,Maintaining public records,Update and maintain electronic and physical records systems,Respond to public inquiries about record availability,Inquiry logs and response documentation,"Names, addresses, contact information, and any other information related to individuals in the public records.","Collecting, storing, updating, and retrieving personal data to respond to public inquiries and maintain accurate records.",To provide access to public records and ensure transparency and accountability in government operations.,"Utah Government Records Access and Management Act (GRAMA) - Utah Code Title 63G, Chapter 2.",The records have significant historical value for documenting government activities and ensuring public accountability. They also have administrative value in maintaining efficient record-keeping systems.,public (controlled) - Utah Code § 63G-2-201,personal data - Utah Code § 63G-2-302,3 years - destroy,GRS-0016
"Utah County, Utah",Clerk,Recording and preserving official documents,Preserve and maintain historical records for public access and research,Recording real estate deeds,"Deed documents, property descriptions","Names, addresses, signatures of property owners","Recording, indexing, and storing real estate deeds",To officially document property ownership changes and transactions,State laws governing real estate transactions and records management,Administrative and legal value for property ownership verification and historical research,protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),"7 years after recording, then destroy (Utah State Archives GS 1-SL)",GS 1-SL Real Property Records
"Utah County, Utah",Clerk,Recording and preserving official documents,Preserve and maintain historical records for public access and research,Maintaining birth and death records,"Birth certificates, death certificates","Personal information of individuals such as name, date of birth, place of birth, parents' names, cause of death, etc.","Collecting, storing, updating, and providing access to birth and death records for legal and administrative purposes.","To accurately document and maintain vital records for legal and genealogical purposes, as well as for public health and statistical analysis.","Utah Code, Title 26, Chapter 2, Vital Statistics Act, which governs the registration and maintenance of birth and death records in the state.","The birth and death records have significant historical, legal, and administrative value as they serve as official documentation of vital events and are essential for legal and genealogical research.",protected (Utah Code 26-2-22),private (Utah Code 26-2-22),Birth records: Permanent retention; Death records: Permanent retention,GRS-UT-2019-001
"Utah County, Utah",Clerk,Recording and preserving official documents,Preserve and maintain historical records for public access and research,Archiving historical documents,"Historical records, manuscripts, photographs","Names, addresses, dates of birth, social security numbers, or any other identifying information of individuals contained in historical documents","Cataloging, indexing, digitizing, and providing access to historical documents for public research",To preserve and maintain historical records for public access and research purposes,"Utah Code Title 63G, Chapter 2, Government Records Access and Management Act (GRAMA)","Historical and research value for public access, legal value for evidentiary purposes",protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),Permanent retention; Transfer to State Archives after 10 years,Utah State Archives General Retention Schedule - Government Records Access and Management Act (GRAMA)
"Utah County, Utah",Clerk,Recording and preserving official documents,Preserve and maintain historical records for public access and research,Assisting public with research requests,"Research inquiries, reference materials","Names, addresses, birth dates, social security numbers, or any other identifying information of individuals contained in historical records or research inquiries.","Accessing, storing, and retrieving personal data for research requests and public access.","To preserve and maintain historical records for public access and research purposes, including assisting the public with research inquiries.","Utah Code, Title 17, Chapter 21 - County Recorder, which outlines the duties and responsibilities of county clerks in recording and preserving official documents.","The historical and research value of the records, providing insight into the county's history and serving as a resource for public information and genealogical research.",protected - Utah Code 63G-2-305(1)(a),controlled - Utah Code 63G-2-202(1)(d),Permanent - Transfer to State Archives after 10 years,GRS-0356
"Utah County, Utah",Clerk,Recording and preserving official documents,Preserve and maintain historical records for public access and research,Providing access to public records,"Public record indexes, digital archives","Any information contained in a record that can be linked to an identified individual or an identifiable individual, such as names, addresses, social security numbers, or other identifying information.","Processing personal data to provide access to public records, maintaining record indexes, and managing digital archives.","To facilitate public access to official documents, support historical research, and ensure transparency and accountability in government operations.","Government Records Access and Management Act (GRAMA) in Utah, which governs the access to government records and outlines the obligations of governmental entities in managing and providing access to public records.","The records have significant historical value for preserving the county's official documents, supporting research on local history and genealogy, ensuring transparency in government operations, and facilitating public accountability.",protected - Utah Code 63G-2-305(1)(b),private - Utah Code 63G-2-202(1),Permanent retention; Transfer to state archives after specified period for permanent preservation,GRS-0016
"Utah County, Utah",Clerk,Recording and preserving official documents,Provide certified copies of recorded documents upon request,Record real estate deeds,"Deeds, titles, and related legal documents","Names, addresses, signatures, property information","Recording, indexing, storing, retrieving, and providing copies of documents",To maintain a public record of real estate ownership and transactions,"Utah Code Title 17, Chapter 21 - County Recorder",Legal and historical evidence of property ownership and transactions,protected - Utah Code 63G-2-305(1)(a),private - Utah Code 63G-2-302(1),Permanent - Transfer to State Archives after 10 years,GRS-0106 Real Property Records
"Utah County, Utah",Clerk,Recording and preserving official documents,Provide certified copies of recorded documents upon request,Issue certified copies of recorded documents,Certified copies of recorded documents and related paperwork,"Names, addresses, signatures, social security numbers, property information, and any other personally identifiable information contained in the recorded documents.","Collecting, storing, retrieving, and providing access to certified copies of recorded documents for official and public use.","To maintain a public record of official documents and provide individuals with certified copies as needed for legal, administrative, or personal purposes.","Utah Code, Title 17, Chapter 21 - County Recorder, which outlines the duties and responsibilities of county clerks in recording and preserving official documents.","The records hold historical value as they document legal transactions, property ownership, and other official activities. They also have administrative value in providing evidence of official actions and legal compliance.",protected (Utah Code Section 63G-2-305),private (Utah Code Section 63G-2-302),"Retain for 7 years, then securely destroy (Utah State Archives General Schedule 1, Item 31)",GS1-31
"Utah County, Utah",Clerk,Recording and preserving official documents,Provide certified copies of recorded documents upon request,Accept and file marriage licenses,Marriage licenses and related forms,"Names, addresses, dates of birth, and other identifying information of individuals applying for marriage licenses.","Collecting, storing, and providing access to personal data for the purpose of issuing marriage licenses and maintaining official records.",To facilitate the legal union of individuals and maintain accurate records of marriages within the jurisdiction.,"Utah Code Annotated, Title 30, Chapter 1, Part 1 - Marriage",The records have legal and historical significance as they document the formation of marital relationships and are essential for legal and administrative purposes.,protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)(d)),"Retain for 75 years from the date of filing, then transfer to the Utah State Archives for permanent preservation","County Clerk Records, GS10-1"
"Utah County, Utah",Clerk,Recording and preserving official documents,Provide certified copies of recorded documents upon request,Provide information on property ownership,Property ownership records and related documentation,"Names, addresses, and other identifying information of property owners",To provide information on property ownership to the public and fulfill requests for certified copies of recorded documents,To enable individuals to confirm property ownership and conduct real estate transactions,"Utah Code Title 57, Chapter 3, Section 105 - Duties of county recorder",Administrative value for property transactions and historical value for property ownership documentation,protected (Utah Code 63G-2-305),private (Utah Code 63G-2-302),Property ownership records: retain permanently; related documentation: retain for 10 years after property transfer or final disposition,GRS-0103
"Utah County, Utah",Clerk,Recording and preserving official documents,Provide certified copies of recorded documents upon request,Maintain indexes of recorded documents,Indexes of recorded documents and related data,"Names, addresses, property information, signatures, and other identifying details of individuals contained in recorded documents.","To provide certified copies of recorded documents, maintain accurate indexes, and facilitate public access to official records.","To ensure transparency, accountability, and accessibility of government records, as well as to provide proof of legal transactions and property ownership.","Utah Code, Title 17, Chapter 21 - County Recorders, which outlines the duties and responsibilities of county clerks in recording and preserving official documents.","The records have significant historical value for tracking property ownership, legal transactions, and land use in the county. They also serve administrative purposes by enabling efficient retrieval of information and supporting evidence in legal proceedings.",protected (Utah Code 63G-2-305(1)),private (Utah Code 63G-2-302(1)),"7 years after the document is recorded, then destroy (Utah State Archives RDA 590)",RDA 590 - County Recorder Records
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,Record real estate deeds,"Deed documents, legal descriptions","Names, addresses, signatures of property owners","Capturing, storing, retrieving, and disseminating information for public access and legal purposes",To provide a public record of property ownership and transfers for legal and historical purposes,State laws governing the recording of real estate deeds and property transactions,"Historical value in documenting property ownership, legal value in establishing property rights, administrative value in facilitating property transactions",protected (Utah Code 17-21-18),private (Utah Code 63G-2-302),"7 years after recording, then destroy (Utah State Archives RDA 2195-001)",RDA 2195
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,File liens and mortgages,"Lien documents, mortgage agreements","Names, addresses, social security numbers, financial information","Recording, indexing, storing, retrieving",To establish legal rights and interests in real property,State laws governing property rights and recording of documents,Legal and historical significance for property ownership and transactions,protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"7 years after satisfaction, release, or assignment of lien or mortgage, then destroy (Utah State Archives GS 1-SL)",GS 1-SL
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,Issue marriage licenses,"Marriage license application, marriage certificates","Names, addresses, birth dates, and other identifying information of individuals applying for marriage licenses","Collecting, verifying, and processing personal information to issue marriage licenses",To legally authorize individuals to marry and maintain official records of marriages,"Utah Code Annotated, Title 30, Chapter 1, Part 1 - Marriage","Legal and historical significance for individuals and government agencies, essential for maintaining accurate vital records",protected - Utah Code Section 46-1-21,private - Utah Code Section 46-1-21,"3 years after issuance, then destroy - Utah General Schedule GRAMA",Utah General Schedule GRAMA
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,Record birth and death certificates,"Birth certificates, death certificates","Name, date of birth, place of birth, gender, parents' names, cause of death, date of death, place of death","Recording, indexing, storing, retrieving, and disclosing as required by law",To officially document and certify births and deaths for legal and administrative purposes,"Utah Code Annotated, Title 26, Chapter 2, Vital Statistics Act","Legal evidence of vital events, genealogical research, public health planning, and statistical analysis",protected (Utah Code § 26-2-22),private (Utah Code § 26-2-11),Birth certificates: Permanently retain; Death certificates: Permanently retain,GRS 1-1a
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,File property liens,"Property lien documents, legal descriptions","Names, addresses, social security numbers, financial information","Recording, indexing, storing, retrieving property lien documents",To establish and maintain a public record of property liens for legal and financial purposes,"Utah Code, Title 57, Chapter 3, Part 1 - Recording of Documents","Legal value for property ownership and financial transactions, historical value for research and property history",protected - Utah Code § 63G-2-305(10),private - Utah Code § 63G-2-302(1),"6 years after filing, then destroy - Utah State Archives GS1-0026",GS1-0026
"Utah County, Utah",Clerk,Recording and preserving official documents,Ensure compliance with laws and regulations governing document recording,Record official maps and plats,"Maps, plats, survey documents","Names, addresses, property information of individuals involved in the maps and plats","Indexing, organizing, storing, and providing access to the maps and plats",To maintain a historical and legal record of property boundaries and surveys,State laws governing land records and survey documents,High historical and legal value for property ownership and boundary disputes,protected - Utah Code 63G-2-305,controlled - Utah Code 63G-2-202,"Retain for 10 years, then destroy - Utah State Archives GS 1-SL",GS 1-SL
"Utah County, Utah",Clerk,Conducting public auctions,Manage auction documentation and records,Conduct public auctions,"Auction listings, bidder registration forms, auction results","Name, contact information, financial information of bidders","Collecting, storing, organizing, and disclosing personal data for auction management","To facilitate the registration of bidders, conduct auctions, and communicate auction results",Government Records Access and Management Act (GRAMA) of Utah,"Administrative value for managing auctions, legal value for compliance with auction regulations",controlled (Utah Code 63G-2-305(1)(b)),protected (Utah Code 63G-2-302(1)(d)),"5 years after auction, then destroy (Utah State Archives GS12-3)",GS12 Auction and Bid Records
"Utah County, Utah",Clerk,Conducting public auctions,Manage auction documentation and records,Manage auction documentation,"Auction records, bidder information, auction permits","Bidder information, including name, contact details, and payment information.","To verify bidder identities, process payments, and communicate auction results.",To facilitate the auction process and ensure transparency and fairness.,Utah Government Records Access and Management Act (GRAMA),"Administrative value for conducting auctions, legal value for compliance, and historical value for documenting public transactions.",protected (Utah Code § 63G-2-305(1)(d)),private (Utah Code § 63G-2-302(1)(d)),"5 years after auction, then destroy (Utah State Archives GS1-AD-11)",GS1-SL
"Utah County, Utah",Clerk,Conducting public auctions,Manage auction documentation and records,Record auction results,"Auction result sheets, bidder information, sales receipts",Bidder information,Recording auction results and managing sales receipts,To document and track auction transactions,Utah Code Title 17B Chapter 1 Part 5 Auctions,Legal and administrative value for conducting public auctions and ensuring transparency in the process,protected (Utah Code 63G-2-305(1)(k)),private (Utah Code 63G-2-302(1)(f)),"5 years after auction, then destroy (Utah State Archives GS4-7)",GS4 Auctions and Sales Records
"Utah County, Utah",Clerk,Conducting public auctions,Manage auction documentation and records,Issue auction permits,"Auction permit applications, permit approvals, permit renewals","Name, address, contact information, identification number, financial information","Collecting, storing, reviewing, approving, renewing",To issue and manage auction permits for conducting public auctions,"Utah Code - Title 13, Chapter 5a - County Recorders","Legal value for compliance, historical value for tracking auction activities and permit issuance",protected (Utah Code 63G-2-305(1)(b)),private (Utah Code 63G-2-302(1)),"3 years after expiration or revocation of permit, then destroy (Utah State Archives - General Schedule AU 1)",AU 1
"Utah County, Utah",Clerk,Conducting public auctions,Manage auction documentation and records,Handle auction inquiries,"Inquiry logs, correspondence with bidders, auction information packets","Names, contact information, bidding history, financial information of bidders","Recording, organizing, disclosing to interested parties, responding to inquiries","Facilitate the auction process, communicate with bidders, maintain transparency","State auction laws, public records laws","Legal compliance, financial transparency, historical documentation of auction activities",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"3 years after auction completion, then destroy (Utah State Archives GS2-1100)",GS2-1100
"Utah County, Utah",Clerk,Conducting public auctions,Collect and account for auction proceeds,Conduct public auction,"Auction catalog, bidder registration forms, auctioneer's reports","Name, address, contact information of bidders","To identify and contact winning bidders, maintain records of auction participants",To facilitate the public auction process and ensure transparency in proceedings,Utah Code Ann. § 17-1-1 et seq. - County Clerk's authority to conduct public auctions,"Administrative value for tracking auction activities and financial transactions, legal value for ensuring compliance with auction regulations",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"5 years after auction, then destroy (Utah State Archives GS5-AD-9)",GS5-AD-9
"Utah County, Utah",Clerk,Conducting public auctions,Collect and account for auction proceeds,Collect auction proceeds,"Receipts, financial records, payment logs","Names, contact information, financial information of individuals participating in the public auctions","Recording, tracking, and processing auction proceeds, issuing receipts, maintaining payment logs","To ensure accurate collection and accounting of auction proceeds, provide documentation of transactions, and facilitate financial transparency",Utah Code Section 17-1-1 et seq. authorizes county clerks to conduct public auctions and manage financial transactions,"The records have legal and fiscal value as they document financial transactions, ensure accountability, and support auditing processes",protected (Utah Code § 63G-2-305),personal data (Utah Code § 63G-2-302),"7 years after auction date, then destroy (Utah State Archives GS5-311)",GS5-311
"Utah County, Utah",Clerk,Conducting public auctions,Collect and account for auction proceeds,Distribute auction proceeds,"Distribution records, payment confirmations, accounting statements","Names, addresses, contact information of individuals involved in the auction transactions","To identify and contact individuals for distribution of auction proceeds, to maintain accurate financial records",To ensure accurate and timely distribution of auction proceeds to the rightful individuals,"Utah Code Title 17, Chapter 5, Auctioneers and Auctions","Administrative value for financial accountability, legal value for audit purposes",protected - Utah Code § 63G-2-305(1)(a),private - Utah Code § 63G-2-302(1)(d),"Retain for 7 years, then securely destroy",Auction Records - UT-RDA-0501
"Utah County, Utah",Clerk,Issuing business licenses,Approve or deny business license applications,Receive business license application,Business license application form and supporting documents,"Name, address, contact information, financial information, business details, identification numbers","Review, verify, evaluate, approve or deny business license applications",To determine eligibility for a business license and ensure compliance with regulations,Utah Code Ann. § 13-11-3 - Authority for counties to issue business licenses,"Administrative value for processing applications, legal value for compliance, fiscal value for revenue generation",protected (Utah Code Section 63G-2-305),private (Utah Code Section 63G-2-302),"Retain for 3 years after license expires, then destroy",AC-AU 2966
"Utah County, Utah",Clerk,Issuing business licenses,Approve or deny business license applications,Review business license application,"Business license application form and supporting documents, approval/denial documentation","Name, address, contact information, financial information, business details, identification numbers, signatures, and any other information provided in the business license application.","Collecting, reviewing, verifying, and storing personal data to assess the eligibility of businesses for licenses.",To determine whether a business meets the requirements for obtaining a license to operate legally within the jurisdiction.,"Utah Code Title 13, Chapter 2, Section 2 authorizes counties in Utah to issue business licenses and collect necessary information for such licenses.","The records have administrative value for tracking the approval or denial of business licenses, legal value for compliance verification, and fiscal value for revenue generation and taxation purposes.","protected, Utah Code § 63G-2-305(10)","controlled, Utah Code § 63G-2-302(1)","5 years after approval or denial, then destroy",CLERK-01
"Utah County, Utah",Clerk,Issuing business licenses,Approve or deny business license applications,Approve business license application,"Business license application form, approval documentation","Name, address, contact information of the business owner applying for the license","Reviewing, verifying, and evaluating the business license application",To determine the eligibility of the business owner and the business for obtaining a license,"Utah Code Annotated, Title 13, Chapter 2, Part 2 - Business Licensing Act","Administrative value for tracking and monitoring approved business licenses, legal value for compliance and enforcement purposes",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"3 years after license expires or is revoked, then destroy (Utah State Archives GS 1-SL)",GS 1-SL
"Utah County, Utah",Clerk,Issuing business licenses,Approve or deny business license applications,Deny business license application,"Business license application form, denial documentation","Name, address, contact information, financial information, business details","Review, assess, and verify the information provided in the business license application",To determine the eligibility of an individual or entity to obtain a business license,"Utah Code, Title 13, Chapter 11 - Local Business Licensing Act",Legal value to demonstrate the decision-making process for approving or denying business license applications,protected - Utah Code § 63G-2-305(10),private - Utah Code § 63G-2-302(1),"3 years after denial, then destroy - Utah State Archives General Schedule B: Business Licensing Records",B
"Utah County, Utah",Clerk,Issuing business licenses,Approve or deny business license applications,Issue business license,"Business license document, approval documentation","Name, address, contact information, business details, financial information","Reviewing applications, verifying information, communicating with applicants, issuing licenses","To evaluate and determine eligibility for a business license, maintain records of approved and denied applications","Utah Code, Title 13, Chapter 2, Section 10 - Powers and duties of county clerk","Administrative value for tracking business activities, legal value for compliance, fiscal value for revenue generation",controlled - UC 63G-2-305(1)(a),private - UC 63G-2-302(1),"3 years after license expires or is revoked, then destroy - UC 63G-2-604(1)(a)",A1-3
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Receive business license application,Business license application form and supporting documents,"Name, address, contact information, financial information, business details, and any other information provided on the business license application form.","Reviewing, verifying, and processing the business license application. Storing and maintaining records for future reference and audit purposes.",To issue business licenses and ensure compliance with local regulations and ordinances.,"Utah Code Annotated, Title 13, Chapter 2, Part 2 - Local Government Licensing and Regulation Act","The business license application records have administrative value for managing business licensing processes, legal value for compliance verification, and fiscal value for revenue generation and tracking.",protected - Utah Code § 63G-2-305(10),private - Utah Code § 63G-2-302(1),"5 years after license expiration, then destroy - Utah RDA",Clerk Records - Business Licenses
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Review business license application,"Business license application form and supporting documents, verification documents","Name, address, contact information, identification numbers, financial information, business details","Collecting, storing, reviewing, verifying, issuing",To evaluate and approve business license applications,"Utah Code Annotated, Title 13, Chapter 2, Part 2 - Business Licenses","Legal and administrative value for compliance, audit trail, and business regulation purposes",protected (Utah Code 63G-2-305(10)),private (Utah Code 63G-2-302(1)),"3 years after license expires or is revoked, then destroy (Utah General Schedule GRAMA 3-102)",GRAMA 3-102
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Approve business license application,"Approved business license, payment records","Name, address, contact information, business details of the applicant","Reviewing, verifying, and approving business license applications",To issue business licenses and ensure compliance with local regulations,"Utah Code Annotated, Title 13, Chapter 2, Part 5 - Business Licensing",Legal and administrative value for tracking approved business licenses and payments,protected - Utah Code § 63G-2-305(1)(a),private - Utah Code § 63G-2-302(1)(d),"Retain for 3 years after license expiration, then destroy",ACCT-0013
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Issue business license,"Issued business license, payment records","Name, address, contact information of the individual applying for the business license","Collecting, verifying, and storing personal data to issue business licenses",To facilitate the legal operation of businesses within the jurisdiction,Utah Code Section 13-2-2 authorizes counties to issue business licenses,The issued business licenses have legal and administrative value for tracking businesses operating within the county,protected - Utah Code 63G-2-305(21),protected - Utah Code 63G-2-302(1)(d),"3 years after license expiration, then destroy - Utah State Archives GS4-2",GS4 Business License Records
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Renew business license,"Renewal application form, payment records","Name, address, contact information, business details, payment information","Collecting, storing, organizing, retrieving, updating",To facilitate the renewal of business licenses and maintain accurate records,"Utah Code Annotated, Title 13, Chapter 2, Section 5",Administrative and legal value for compliance and continuity of business operations,protected (Utah Code 63G-2-305(1)(a)),private (Utah Code 63G-2-302(1)(d)),"3 years after license expiration then destroy (Utah General Schedule - County Government Records, Schedule 1)",Schedule 1
"Utah County, Utah",Clerk,Issuing business licenses,Issue business licenses,Update business license information,"Updated business license information form, supporting documents","Name, address, contact information of business owners applying for or holding business licenses","To verify identity, contact applicants, issue and manage business licenses",To facilitate the issuance and management of business licenses in compliance with local regulations,Local ordinances or state laws governing the issuance of business licenses,"Administrative value for tracking business licenses, legal value for compliance, fiscal value for revenue generation through licensing fees",protected - Utah Code § 63G-2-305(1)(a),private - Utah Code § 63G-2-302(1),"3 years after license expiration, then destroy",B.1
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Preparing meeting agendas,Receive requests for agenda items,"Requests for agenda items, emails, meeting notes","Names, contact information, and any other identifying details of individuals requesting agenda items","Collecting, organizing, and storing personal data for the purpose of preparing meeting agendas",To facilitate the inclusion of requested agenda items in local government meetings,"State laws governing public records and open meetings, such as the Utah Public Records Act and the Utah Open and Public Meetings Act",Administrative value in ensuring transparency and accountability in local government decision-making processes,protected (Utah Code 63G-2-305(10)),private (personal data),"1 year after creation, then destroy (Utah General Schedule 1-SL009)",Utah General Schedule 1-SL009
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Preparing meeting agendas,Review and prioritize agenda items,"Agenda item list, meeting notes, emails","Names, contact information, affiliations of individuals mentioned in agenda items or meeting notes","Organizing and prioritizing agenda items, communicating with stakeholders, documenting meeting discussions",Facilitate efficient and transparent local government decision-making process,Government Records Access and Management Act (GRAMA) in Utah,"Critical for ensuring accountability, transparency, and compliance with legal requirements in government proceedings","protected, Utah Code Ann. § 63G-2-305(10)","private, Utah Code Ann. § 63G-2-302(1)","3 years after creation, then destroy","Local Government Records, Schedule 1"
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Preparing meeting agendas,Prepare meeting agendas,"Final meeting agendas, supporting documents, meeting minutes","Names, contact information, affiliations, and any other personal details of individuals involved in the government meetings and agendas.","Compiling, organizing, and disseminating information related to government meetings and agendas.",To facilitate the efficient and transparent conduct of local government meetings and decision-making processes.,Government Records Access and Management Act (GRAMA) in Utah.,"The records have legal and administrative value for documenting the official activities and decisions of the local government, ensuring transparency, accountability, and compliance with regulations.",protected (Utah Code 52-4-7),N/A,"3 years after creation, then destroy (Utah General Schedule GRAMA 1-1)",Utah General Schedule GRAMA 1-1
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Preparing meeting agendas,Publish meeting agendas,"Published meeting agendas, website records","Names, contact information, and any other personal details of individuals mentioned in the meeting agendas.",To inform the public about upcoming local government meetings and decisions.,To facilitate transparency and public participation in local government proceedings.,Government Records Access and Management Act (GRAMA) in Utah.,These records serve as a historical account of local government decision-making and ensure compliance with open meeting laws.,protected - Utah Code 63G-2-305(10)(b),private - Utah Code 63G-2-302(1),"3 years after creation, then destroy - Utah General Schedule GRAMA",UT-RDA-1801
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Preparing meeting agendas,Receive public comments on agenda items,"Public comments, meeting recordings, emails","Names, contact information, opinions, and any other identifying information provided in public comments or emails.","Reviewing, organizing, and publishing public comments, responding to inquiries or requests, and maintaining a record of communication with the public.","To facilitate transparency in local government decision-making processes, gather input from the community, and maintain a record of interactions with the public.","Government Records Access and Management Act (GRAMA) in Utah, Open and Public Meetings Act, and other relevant local and state laws governing public records and meetings.","The records hold significant historical value as they document public engagement in government decision-making, provide transparency into the meeting process, and serve as evidence in case of legal challenges or disputes.",protected - Utah Code 52-4-203,private - Utah Code 63G-2-302,"1 year after creation, then destroy - Utah General Schedule GRAMA",Utah General Schedule GRAMA
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Maintaining records related to meetings and agendas,Receive and process requests to add items to meeting agendas,Agenda item requests and approvals,"Names, contact information, and other details of individuals submitting agenda item requests","Reviewing, verifying, and processing agenda item requests; communicating with requestors and relevant parties; publishing agenda items",To facilitate the addition of items to meeting agendas and ensure transparency and accountability in local government decision-making processes,"State open meeting laws, local government ordinances, and regulations governing the conduct of government meetings and agendas","These records have legal and administrative value as they document the process of adding items to meeting agendas, ensuring compliance with regulations, and preserving transparency in government decision-making",protected (Utah Code 63G-2-305(1)(a)),private (Utah Code 63G-2-302(1)),"3 years after final action, then destroy (Utah State Archives GS 1-SL)",GS 1-SL
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Maintaining records related to meetings and agendas,Publish meeting agendas for public viewing,Published meeting agendas,"Names, addresses, contact information of individuals attending or mentioned in the meetings","To identify individuals participating in the meetings, to contact them for follow-up, and to maintain a record of attendees",To facilitate transparency and accountability in local government decision-making processes,Government Records Access and Management Act (GRAMA) of Utah,"Administrative value for ensuring compliance with open meeting laws, historical value for documenting government proceedings",protected (Utah Code 52-4-204),personal data (Utah Code 63G-2-302),"3 years after the meeting, then destroy (Utah General Schedule GRAMA-1)",Utah General Schedule GRAMA-1
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Maintaining records related to meetings and agendas,Record minutes of local government meetings,Meeting minutes,"Names, addresses, contact information of individuals attending or speaking at meetings","Recording, documenting, and organizing personal data for official government purposes",To maintain transparency and accountability in local government proceedings,Government Records Access and Management Act (GRAMA) in Utah,"Administrative value for tracking decisions, legal value for ensuring compliance, and historical value for preserving local government actions",protected (Utah Code 52-4-7),private (Utah Code 63G-2-302),Permanent - Transfer to State Archives after 7 years (Utah State Archives RDA 2644-2019-001),GRS-0035
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Maintaining records related to meetings and agendas,Respond to inquiries about upcoming meetings and agendas,Correspondence logs,"Names, contact information, affiliations of individuals attending meetings or submitting agenda items","Organizing and scheduling meetings, creating agendas, communicating with stakeholders",To facilitate the functioning of local government meetings and ensure transparency and public participation,"State open meetings laws (e.g., Utah Open and Public Meetings Act)","Critical for ensuring accountability, transparency, and compliance with legal requirements related to government meetings and decision-making",controlled - Utah Code § 63G-2-305(3)(a),private - Utah Code § 63G-2-302(1),"3 years after end of calendar year, then destroy - Utah State Archives GS4-17",GS4 Municipal Records
"Utah County, Utah",Clerk,Overseeing local government meetings and agendas,Maintaining records related to meetings and agendas,Maintain archives of past meeting agendas and minutes,Archived meeting agendas and minutes,"Names, contact information, affiliations, and any other identifying details of individuals mentioned in meeting agendas and minutes.","Organizing, categorizing, and storing personal data for retrieval and reference purposes.",To document and provide a historical record of local government meetings and decisions made.,"State laws governing public records and open meetings, such as the Utah Public Records Act and the Utah Open and Public Meetings Act.","The records hold significant historical value for transparency, accountability, and legal compliance. They also serve as a reference for future decision-making and public information.","controlled, Utah Code 63G-2-305(10)","protected, Utah Code 63G-2-302(1)(d)","Permanent, Transfer to State Archives after 10 years",GRS-1700`

function parseCSVFallback(): Model[] {
  return parseCSV(CSV_DATA)
}

function parseCSV(csv: string): Model[] {
  // Parse CSV with proper quote handling
  function parseCSVLine(line: string): string[] {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''))
    return values
  }

  const lines = csv.split('\n').filter(line => line.trim())
  console.log('Total CSV lines:', lines.length)

  const headers = parseCSVLine(lines[0])
  console.log('Headers:', headers)

  // Group by Government Unit + Core Functions to create one row per core function
  const cfMap = new Map<string, { unit: string; office: string; cfName: string; transactions: Transaction[] }>()

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    console.log(`Row ${i}:`, values.slice(0, 5))

    const row: Record<string, string> = {}

    headers.forEach((header, idx) => {
      row[header] = values[idx] || ""
    })

    const unit = row["Government Unit"] || "County"
    const office = row["Office"] || "Clerk"
    const cfName = row["Core Functions"] || "Marriage licenses"
    const primaryDuties = row["Primary Duties"] || ""

    console.log(`  -> unit: "${unit}", cf: "${cfName}", pd: "${primaryDuties}"`)

    // Skip rows with no primary duties or core functions
    if (!primaryDuties.trim() || !cfName.trim()) {
      console.log(`  -> SKIPPED (empty pd or cf)`)
      continue
    }

    const cfKey = `${unit}|${cfName}`

    if (!cfMap.has(cfKey)) {
      cfMap.set(cfKey, {
        unit,
        office,
        cfName,
        transactions: []
      })
      console.log(`  -> Created new cf group: ${cfKey}`)
    }

    const transaction: Transaction = {
      id: `tx-${i}`,
      primaryDuties: primaryDuties,
      transactions: row["Transactions"] || "",
      relatedRecords: row["Related Records"] || "",
      personalData: row["Personal Data in the Records"] || "",
      useOfPersonalData: row["Use of Personal Data"] || "",
      purposeOfProcessing: row["Purpose of Processing Personal Data"] || "",
      statutoryAuthorization: row["Statutory Authorization"] || "",
      valueOfRecords: row["Value of the Records"] || "",
      primaryClassification: row["Primary Classification"] || "",
      secondaryClassification: row["Secondary Classification"] || "",
      authorityForProcessing: row["Authority for Processing Personal Data"] || "",
      retentionPeriod: row["Retention Period for Personal Data"] || "",
      retentionDisposition: row["Retention & Disposition"] || "",
      generalRetentionSchedule: row["General Retention Schedule"] || "",
      status: Math.random() > 0.6 ? "approved" : Math.random() > 0.3 ? "pending" : "needs-answer"
    }

    cfMap.get(cfKey)!.transactions.push(transaction)
  }

  // Convert to Model array where each entry is a core function
  const models = Array.from(cfMap.entries()).map(([cfKey, data], idx) => ({
    id: `model-${idx}`,
    governmentUnit: data.unit,
    office: data.office,
    approved: Math.random() > 0.5,
    lastUpdate: new Date(2024, 5, 10 + Math.floor(Math.random() * 10)).toISOString().split('T')[0],
    owner: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Wilson", "Lisa Anderson"][Math.floor(Math.random() * 5)],
    coreFunctions: [
      {
        id: cfKey,
        name: data.cfName,
        transactions: data.transactions
      }
    ]
  }))

  console.log('====== FINAL RESULT ======')
  console.log('Parsed models count:', models.length)
  console.log('Core functions:', Array.from(cfMap.keys()))
  console.log('Models:', models)

  return models
}


type AgentEntry = {
  agent: string
  stage: number
  context: Record<string, string>
  sources_count: number
  sources: string[]
  status: "running" | "completed"
  started_at: string
  duration_ms?: number
  output?: unknown
}

type RunLog = {
  government_unit: string
  office: string
  generated_at: string
  duration_ms: number
  rows_generated: number
  status: "running" | "completed"
  agents: AgentEntry[]
}

type LogState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: RunLog }
  | { status: "error"; message: string }

async function fetchRunLog(governmentUnit: string, office: string): Promise<RunLog> {
  const govUnit = governmentUnit.replace(/, Utah$/, "").trim()
  const token = localStorage.getItem("access_token")
  const params = new URLSearchParams({ government_unit: govUnit, office })
  const resp = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/governance-model/log?${params}`,
    { headers: { Authorization: `Bearer ${token ?? ""}` } }
  )
  if (!resp.ok) {
    if (resp.status === 404) throw new Error("No log yet — generate this model first.")
    throw new Error(`Server error (${resp.status})`)
  }
  return resp.json()
}

function fmtMs(ms: number) {
  if (!ms) return "0ms"
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)} min`
}

function RunLogNarrative({ data }: { data: RunLog }) {
  const byStage = new Map<number, AgentEntry[]>()
  for (const e of data.agents ?? []) {
    const b = byStage.get(e.stage) ?? []
    b.push(e)
    byStage.set(e.stage, b)
  }
  const stages = [...byStage.keys()].sort((a, b) => a - b)
  const blocks: React.ReactNode[] = []
  let i = 0
  while (i < stages.length) {
    const stage = stages[i]
    const entries = byStage.get(stage)!
    const name = entries[0].agent
    const completed = entries.filter(e => e.status === "completed")
    const totalMs = completed.reduce((s, e) => s + (e.duration_ms ?? 0), 0)
    const totalOut = completed.reduce((s, e) => s + (Array.isArray(e.output) ? e.output.length : e.output ? 1 : 0), 0)
    const src = entries[0].sources_count ?? 0
    const nextStage = stages[i + 1]

    if (stage === 4 && nextStage === 5) {
      const e5 = byStage.get(5)!
      const n5 = e5[0].agent
      const c5 = e5.filter(e => e.status === "completed")
      const ms5 = c5.reduce((s, e) => s + (e.duration_ms ?? 0), 0)
      const src5 = e5[0].sources_count ?? 0
      blocks.push(
        <div key={`s${stage}`} className="rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3 space-y-1">
          <p className="text-sm">In parallel, <strong>{name}</strong> and <strong>{n5}</strong> agents started on each transaction <span className="text-muted-foreground font-normal">({entries.length} + {e5.length} calls)</span>.</p>
          <p className="text-xs text-muted-foreground">{fmtMs(Math.max(totalMs, ms5))} later, both completed — {name} referenced {src} source{src !== 1 ? "s" : ""}, {n5} referenced {src5} source{src5 !== 1 ? "s" : ""}.</p>
        </div>
      )
      i += 2
      continue
    }

    const ctx = entries[0].context ?? {}
    const raw = ctx.transaction || ctx.primary_duty || ctx.core_function || ""
    const subject = raw
      ? `"${raw.slice(0, 50)}${raw.length > 50 ? "…" : ""}"`
      : `${data.government_unit} · ${data.office}`
    const callStr = entries.length > 1 ? ` (${entries.length} calls)` : ""
    blocks.push(
      <div key={`s${stage}`} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
          <div className="w-px flex-1 bg-border mt-1" />
        </div>
        <div className="pb-1 space-y-0.5">
          <p className="text-sm leading-snug"><strong>{name}</strong> agent started working on {subject}{callStr}.</p>
          <p className="text-xs text-muted-foreground">
            {completed.length > 0
              ? `${fmtMs(totalMs)} later, completed. Generated ${totalOut} answer${totalOut !== 1 ? "s" : ""} referencing ${src} source${src !== 1 ? "s" : ""}.`
              : "Still running…"}
          </p>
        </div>
      </div>
    )
    i++
  }

  if (blocks.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-8">No agent entries recorded.</p>
  }
  return (
    <div className="space-y-5 pl-1">
      {data.status === "running" && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
          <Loader2 className="w-3 h-3 animate-spin shrink-0" />
          Generation in progress — updating live…
        </div>
      )}
      {blocks}
      <div className="border-t pt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{data.rows_generated} rows</span>
        <span>·</span>
        <span>{fmtMs(data.duration_ms)} so far</span>
        <span>·</span>
        <span>{new Date(data.generated_at).toLocaleString()}</span>
      </div>
    </div>
  )
}

function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [filteredGovernment, setFilteredGovernment] = useState("")
  const [filteredOffice, setFilteredOffice] = useState("")
  const [filteredFunction, setFilteredFunction] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [logState, setLogState] = useState<LogState>({ status: "idle" })
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)

  async function handleRegenerate(model: Model) {
    if (regeneratingId) return
    setRegeneratingId(model.id)
    try {
      const token = localStorage.getItem("access_token")
      const govUnit = model.governmentUnit.replace(/, Utah$/, "").trim()
      const refs = getReferencesForUnit(govUnit).map(r => ({
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
            government_unit: govUnit,
            office: model.office,
            references: refs,
          }),
        }
      )
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${govUnit.replace(/ /g, "_")}_${model.office.replace(/ /g, "_")}_governance_model.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Regenerate failed:", err)
    } finally {
      setRegeneratingId(null)
    }
  }

  useEffect(() => {
    ;(async () => {
      const data = await fetchModelsFromAPI()
      setModels(data)
    })()
  }, [])

  useEffect(() => {
    if (!showNotes || !selectedModel) return
    setLogState({ status: "loading" })
    fetchRunLog(selectedModel.governmentUnit, selectedModel.office)
      .then((data) => setLogState({ status: "loaded", data }))
      .catch((err) => setLogState({ status: "error", message: err.message }))
  }, [showNotes, selectedModel])

  useEffect(() => {
    if (!showNotes || !selectedModel) return
    if (logState.status !== "loaded" || logState.data.status !== "running") return
    const interval = setInterval(() => {
      fetchRunLog(selectedModel.governmentUnit, selectedModel.office)
        .then((data) => setLogState({ status: "loaded", data }))
        .catch(() => {})
    }, 3000)
    return () => clearInterval(interval)
  }, [showNotes, selectedModel, logState])

  const filtered = models.filter(
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
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Core Function</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Owner</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Last Updated</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((model) => (
              <tr key={model.id} className="hover:bg-muted/20">
                <td className="px-4 py-2.5 text-sm text-foreground">{model.governmentUnit}</td>
                <td className="px-4 py-2.5 text-sm text-foreground">{model.office}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-foreground">{model.coreFunctions[0]?.name}</td>
                <td className="px-4 py-2.5 text-sm text-foreground">{model.owner}</td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground">{model.lastUpdate}</td>
                <td className="px-4 py-2.5">
                  <Badge className={`text-[10px] ${model.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {model.approved ? "Approved" : "Pending"}
                  </Badge>
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
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      const blob = new Blob([CSV_DATA], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "governance-models.csv"
                      a.click()
                      URL.revokeObjectURL(url)
                    }}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={regeneratingId === model.id}
                      onClick={() => handleRegenerate(model)}
                    >
                      {regeneratingId === model.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="h-3.5 w-3.5" />
                      }
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={showNotes} onOpenChange={(open) => { setShowNotes(open); if (!open) setLogState({ status: "idle" }) }}>
        <SheetContent className="w-[520px] flex flex-col px-6">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-base">Agent Run Log</SheetTitle>
            {selectedModel && (
              <p className="text-xs text-muted-foreground">{selectedModel.governmentUnit} · {selectedModel.office}</p>
            )}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mt-2 space-y-1 text-sm">
            {logState.status === "loading" && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading log...
              </div>
            )}
            {logState.status === "error" && (
              <p className="text-muted-foreground text-center py-12 text-xs">{logState.message}</p>
            )}
            {logState.status === "loaded" && <RunLogNarrative data={logState.data} />}
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

  const FIELD_REFERENCES: Record<string, Reference[]> = {
    statutoryAuthorization: [
      REFERENCES.find(r => r.codes.includes("20a-2"))!,
      REFERENCES.find(r => r.codes.includes("20a-9"))!,
      REFERENCES.find(r => r.codes.includes("81-2"))!,
    ].filter(Boolean),
    primaryClassification: [
      REFERENCES.find(r => r.codes.includes("63g-2-305"))!,
      REFERENCES.find(r => r.codes.includes("63g-2-301"))!,
    ].filter(Boolean),
    secondaryClassification: [
      REFERENCES.find(r => r.codes.includes("63g-2-302"))!,
      REFERENCES.find(r => r.codes.includes("63g-2-305"))!,
    ].filter(Boolean),
    personalData: [
      REFERENCES.find(r => r.codes.includes("63g-2-302"))!,
      REFERENCES.find(r => r.codes.includes("63g-2-305"))!,
    ].filter(Boolean),
    useOfPersonalData: [
      REFERENCES.find(r => r.codes.includes("63g-2-302"))!,
    ].filter(Boolean),
    purposeOfProcessing: [
      REFERENCES.find(r => r.codes.includes("63g-2-302"))!,
      REFERENCES.find(r => r.codes.includes("20a-2"))!,
    ].filter(Boolean),
    retentionDisposition: [
      REFERENCES.find(r => r.codes.includes("63g-2-301"))!,
    ].filter(Boolean),
    generalRetentionSchedule: [
      REFERENCES.find(r => r.codes.includes("63g-2-301"))!,
    ].filter(Boolean),
    relatedRecords: [
      REFERENCES.find(r => r.codes.includes("63g-2-301"))!,
      REFERENCES.find(r => r.codes.includes("57-3"))!,
    ].filter(Boolean),
    valueOfRecords: [
      REFERENCES.find(r => r.codes.includes("63g-2-301"))!,
    ].filter(Boolean),
  }

  const getReferencesForField = (_text: string, fieldKey?: string) => {
    if (fieldKey && FIELD_REFERENCES[fieldKey]) return FIELD_REFERENCES[fieldKey]
    return []
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
        <h1 className="text-lg font-semibold">{model.governmentUnit} - {model.coreFunctions[0]?.name}</h1>
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{model.governmentUnit}</Badge>
          <Badge variant="outline" className="text-xs">{model.office}</Badge>
          <Badge variant="outline" className="text-xs">{model.owner}</Badge>
          <Badge variant="outline" className="text-xs">{model.lastUpdate}</Badge>
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
            {modelApproved ? "Unapprove" : "Approve"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {model.coreFunctions.flatMap((coreFunction) => {
          // Group transactions by primaryDuties for accordion headers
          const pdGroups = new Map<string, typeof coreFunction.transactions>()
          coreFunction.transactions.forEach(tx => {
            const pd = tx.primaryDuties || "(no primary duties)"
            if (!pdGroups.has(pd)) pdGroups.set(pd, [])
            pdGroups.get(pd)!.push(tx)
          })
          return Array.from(pdGroups.entries()).map(([pd, txs]) => {
          const groupId = `${coreFunction.id}|${pd}`
          return (
          <div key={groupId} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedCoreFunction(expandedCoreFunction === groupId ? null : groupId)}
              className="w-full px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between gap-3 bg-muted/20"
            >
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold">{pd}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {txs.length}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  expandedCoreFunction === groupId ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCoreFunction === groupId && (
              <div className="space-y-2 border-t p-4 bg-white">
                {txs.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg overflow-hidden bg-muted/5">
                    <button
                      onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                      className="w-full px-4 py-3 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-medium">
                          {transaction.transactions}
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

                                {(() => {
                                  const refs = getReferencesForField(String(value), key)
                                  return refs.length > 0 ? (
                                    <div className="space-y-2">
                                      <div className="text-xs font-medium text-muted-foreground mb-2">Relevant References:</div>
                                      <div className="text-xs space-y-2 mb-3 pl-2 border-l-2 border-muted-foreground/20">
                                        {refs.map((ref, idx) => (
                                          <div key={idx} className="space-y-1">
                                            <a
                                              href={ref.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="font-medium text-blue-600 hover:underline"
                                            >
                                              {ref.name} ↗
                                            </a>
                                            <p className="text-muted-foreground">{ref.description}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null
                                })()}

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
                                    {isApproved ? "Unapprove" : "Approve"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => { /* Regenerate answer logic */ }}
                                  >
                                    Regenerate answer
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
          )
        })})}

      </div>
    </div>
  )
}