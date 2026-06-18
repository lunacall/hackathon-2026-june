import csv
import concurrent.futures
import io
import json
import logging
from typing import Any

from fastapi import APIRouter
from fastapi.responses import Response
from openai import OpenAI
from pydantic import BaseModel

from app.api.deps import CurrentUser, SessionDep
from app.api.data_sources import format_sources_for_prompt, get_sources
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/governance-model", tags=["governance-model"])

openai_client = OpenAI(api_key=settings.OPENAI_KEY)

CSV_HEADERS = [
    "Government Unit",
    "Office",
    "Core Functions",
    "Primary Duties",
    "Transactions",
    "Related Records",
    "Personal Data in the Records",
    "Use of Personal Data",
    "Purpose of Processing Personal Data",
    "Statutory Authorization",
    "Value of the Records",
    "Primary Classification",
    "Secondary Classification",
    "Retention & Disposition",
    "General Retention Schedule",
]

COLUMN_DEFINITIONS = {
    "Government Unit": "The unique legal, administrative, or political entity—such as a state agency, county, municipality, or special district—that has the authority to govern within a specific area.",
    "Office": "The specific division, department, or administrative unit that is responsible for providing public services.",
    "Core Functions": "A governmental entity's statutory responsibilities or obligations.",
    "Primary Duties": "Specific tasks or actions that are critical to a governmental entity's purpose, mission, or operation.",
    "Transactions": "Any interaction or exchange between a governmental entity and a member of the public in furtherance of the governmental entity's primary duties.",
    "Related Records": "Documentary material or data, either in an electronic or physical format, that is collected or generated in the course of a transaction.",
    "Personal Data in the Records": "Any information contained in a record that is linked or can be reasonably linked to an identified individual or an identifiable individual.",
    "Use of Personal Data": "How personal data is processed or any operations performed on personal data.",
    "Purpose of Processing Personal Data": "The reason why personal data is processed.",
    "Statutory Authorization": "The legal authority that requires or allows a governmental entity to process personal data.",
    "Value of the Records": "The historical, administrative, legal or fiscal value of the record.",
    "Primary Classification": "How the record is generally classified (private, controlled, protected, or exempt) and the citation that describes the classification.",
    "Secondary Classification": "The classification of any personal data contained in a record and the citation that describes the secondary classification.",
    "Retention & Disposition": "How long the records must be retained and when the records must be destroyed.",
    "General Retention Schedule": "The reference code or name of the retention schedule that applies to these records.",
}


class GovernanceModelCreate(BaseModel):
    government_unit: str
    office: str


def _call_llm(prompt: str, system_message: str) -> str:
    """Make an OpenAI API call and return the response text."""
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        max_tokens=2000,
    )
    return response.choices[0].message.content


def _get_core_functions(government_unit: str, office: str) -> list[str]:
    """Agent: Discover all Core Functions for the office."""
    sources = get_sources(government_unit, office, "core_functions")
    sources_text = format_sources_for_prompt(sources)

    prompt = (
        f"For {office} in {government_unit}, identify all Core Functions.\n\n"
        f"Core Functions: {COLUMN_DEFINITIONS['Core Functions']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY a JSON array of strings, one per core function. Example: "
        f'["Marriage licenses", "Business licenses", "Records management"]'
    )

    response = _call_llm(prompt, "You are an expert in Utah government structure and functions.")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse core functions: {response}")
        return []


def _get_primary_duties(government_unit: str, office: str, core_function: str) -> list[str]:
    """Agent: Discover all Primary Duties for a Core Function."""
    sources = get_sources(government_unit, office, "primary_duties")
    sources_text = format_sources_for_prompt(sources)

    prompt = (
        f"For {office} in {government_unit}, identify all Primary Duties for the core function: {core_function}\n\n"
        f"Primary Duties: {COLUMN_DEFINITIONS['Primary Duties']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY a JSON array of strings, one per primary duty. Example: "
        f'["Issue licenses", "Process applications", "Maintain records"]'
    )

    response = _call_llm(prompt, "You are an expert in government operations and statutory duties.")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse primary duties: {response}")
        return []


def _get_transactions(government_unit: str, office: str, core_function: str, primary_duty: str) -> list[dict]:
    """Agent: Discover Transactions and Related Records for a Primary Duty."""
    sources = get_sources(government_unit, office, "transactions")
    sources_text = format_sources_for_prompt(sources)

    prompt = (
        f"For {office} in {government_unit}, identify all Transactions for:\n"
        f"Core Function: {core_function}\n"
        f"Primary Duty: {primary_duty}\n\n"
        f"Transaction: {COLUMN_DEFINITIONS['Transactions']}\n"
        f"Related Records: {COLUMN_DEFINITIONS['Related Records']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY a JSON array of objects with 'transaction' and 'related_records' keys. Example:\n"
        f'[{{"transaction": "Process application", "related_records": "Application form and supporting documents"}}, ...]'
    )

    response = _call_llm(prompt, "You are an expert in government transactions and record creation.")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse transactions: {response}")
        return []


def _get_personal_data_info(government_unit: str, office: str, core_function: str, primary_duty: str, transaction: str, related_records: str) -> dict:
    """Agent: Fill in Personal Data-related columns."""
    sources = get_sources(government_unit, office, "personal_data")
    sources_text = format_sources_for_prompt(sources)

    prompt = (
        f"For {office} in {government_unit}:\n"
        f"Core Function: {core_function}\n"
        f"Primary Duty: {primary_duty}\n"
        f"Transaction: {transaction}\n"
        f"Related Records: {related_records}\n\n"
        f"Fill in these columns (return as JSON object):\n"
        f"- personal_data: {COLUMN_DEFINITIONS['Personal Data in the Records']}\n"
        f"- use_of_data: {COLUMN_DEFINITIONS['Use of Personal Data']}\n"
        f"- purpose: {COLUMN_DEFINITIONS['Purpose of Processing Personal Data']}\n"
        f"- statutory_auth: {COLUMN_DEFINITIONS['Statutory Authorization']}\n"
        f"- value_of_records: {COLUMN_DEFINITIONS['Value of the Records']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY valid JSON with these 5 keys. Example:\n"
        f'{{"personal_data": "...", "use_of_data": "...", "purpose": "...", "statutory_auth": "...", "value_of_records": "..."}}'
    )

    response = _call_llm(prompt, "You are an expert in data privacy and government records management.")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse personal data info: {response}")
        return {}


def _get_retention_info(government_unit: str, office: str, core_function: str, primary_duty: str, transaction: str, related_records: str) -> dict:
    """Agent: Fill in Retention-related columns."""
    sources = get_sources(government_unit, office, "retention")
    sources_text = format_sources_for_prompt(sources)

    prompt = (
        f"For {office} in {government_unit}:\n"
        f"Core Function: {core_function}\n"
        f"Primary Duty: {primary_duty}\n"
        f"Transaction: {transaction}\n"
        f"Related Records: {related_records}\n\n"
        f"Fill in these columns (return as JSON object):\n"
        f"- primary_classification: {COLUMN_DEFINITIONS['Primary Classification']}\n"
        f"- secondary_classification: {COLUMN_DEFINITIONS['Secondary Classification']}\n"
        f"- retention_disposition: {COLUMN_DEFINITIONS['Retention & Disposition']}\n"
        f"- general_schedule: {COLUMN_DEFINITIONS['General Retention Schedule']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY valid JSON with these 4 keys. Example:\n"
        f'{{"primary_classification": "...", "secondary_classification": "...", "retention_disposition": "...", "general_schedule": "..."}}'
    )

    response = _call_llm(prompt, "You are an expert in records retention and classification.")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse retention info: {response}")
        return {}


@router.post("/")
def create_governance_model(
    *, session: SessionDep, current_user: CurrentUser, model_in: GovernanceModelCreate
) -> Any:
    """
    Create a governance model using a multi-agent orchestration approach.
    """
    logger.info(f"Starting governance model generation for {model_in.office} in {model_in.government_unit}")

    rows = []

    # Stage 1: Get Core Functions
    logger.info("Stage 1: Discovering Core Functions")
    core_functions = _get_core_functions(model_in.government_unit, model_in.office)
    logger.info(f"Found {len(core_functions)} core functions")

    # Stage 2-5: For each core function
    for cf in core_functions:
        logger.info(f"Processing Core Function: {cf}")
        primary_duties = _get_primary_duties(model_in.government_unit, model_in.office, cf)
        logger.info(f"  Found {len(primary_duties)} primary duties")

        # Stage 3: For each primary duty
        for pd in primary_duties:
            logger.info(f"  Processing Primary Duty: {pd}")
            transactions = _get_transactions(model_in.government_unit, model_in.office, cf, pd)
            logger.info(f"    Found {len(transactions)} transactions")

            # Stage 4-5: For each transaction, run Personal Data and Retention agents in parallel
            for trans_obj in transactions:
                transaction = trans_obj.get("transaction", "")
                related_records = trans_obj.get("related_records", "")

                # Run Personal Data and Retention agents concurrently
                with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                    personal_data_future = executor.submit(
                        _get_personal_data_info,
                        model_in.government_unit, model_in.office, cf, pd, transaction, related_records
                    )
                    retention_future = executor.submit(
                        _get_retention_info,
                        model_in.government_unit, model_in.office, cf, pd, transaction, related_records
                    )

                    personal_data_info = personal_data_future.result()
                    retention_info = retention_future.result()

                # Combine all data into a row
                row = [
                    model_in.government_unit,
                    model_in.office,
                    cf,
                    pd,
                    transaction,
                    related_records,
                    personal_data_info.get("personal_data", ""),
                    personal_data_info.get("use_of_data", ""),
                    personal_data_info.get("purpose", ""),
                    personal_data_info.get("statutory_auth", ""),
                    personal_data_info.get("value_of_records", ""),
                    retention_info.get("primary_classification", ""),
                    retention_info.get("secondary_classification", ""),
                    retention_info.get("retention_disposition", ""),
                    retention_info.get("general_schedule", ""),
                ]
                rows.append(row)
                logger.info(f"    Added row for transaction: {transaction}")

    # Generate CSV output
    logger.info(f"Generating CSV with {len(rows)} rows")
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(CSV_HEADERS)
    writer.writerows(rows)

    csv_content = output.getvalue()
    filename = f"{model_in.government_unit.replace(' ', '_')}_{model_in.office.replace(' ', '_')}_governance_model.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
