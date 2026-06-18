import csv
import concurrent.futures
import io
import json
import logging
import re
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

from fastapi import APIRouter, HTTPException, Query
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

RUNS_DIR = Path("/tmp/gov_runs")
RUNS_DIR.mkdir(parents=True, exist_ok=True)

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


class ReferenceSource(BaseModel):
    name: str
    url: str
    agents: list[str]


class GovernanceModelCreate(BaseModel):
    government_unit: str
    office: str
    references: list[ReferenceSource] = []


def _log_key(government_unit: str, office: str) -> str:
    raw = f"{government_unit}__{office}".lower()
    return re.sub(r"[^a-z0-9]+", "_", raw).strip("_")


def _call_llm(prompt: str, system_message: str) -> str:
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


def _sources_info(model_in: GovernanceModelCreate, agent_category: str) -> tuple[str, int, list[str]]:
    """Return (formatted_text, count, source_names)."""
    filtered = [r for r in model_in.references if agent_category in r.agents]
    if filtered:
        return (
            format_sources_for_prompt([
                {"cite": r.name, "title": r.name, "url": r.url, "description": ""}
                for r in filtered
            ]),
            len(filtered),
            [r.name for r in filtered],
        )
    sources = get_sources(model_in.government_unit, model_in.office, agent_category)
    return (
        format_sources_for_prompt(sources),
        len(sources),
        [s.get("cite", s.get("title", "")) for s in sources],
    )


def _get_core_functions(
    model_in: GovernanceModelCreate, log: list, flush: Callable
) -> list[str]:
    sources_text, sources_count, source_names = _sources_info(model_in, "core_functions")
    entry: dict = {
        "agent": "Core Functions",
        "stage": 1,
        "context": {},
        "sources_count": sources_count,
        "sources": source_names,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    log.append(entry)
    flush()

    t0 = time.time()
    prompt = (
        f"For {model_in.office} in {model_in.government_unit}, identify all Core Functions.\n\n"
        f"Core Functions: {COLUMN_DEFINITIONS['Core Functions']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY a JSON array of strings, one per core function. Example: "
        f'["Marriage licenses", "Business licenses", "Records management"]'
    )
    response = _call_llm(prompt, "You are an expert in Utah government structure and functions.")
    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse core functions: {response}")
        result = []

    entry.update({
        "status": "completed",
        "duration_ms": int((time.time() - t0) * 1000),
        "output": result,
    })
    flush()
    return result


def _get_primary_duties(
    model_in: GovernanceModelCreate, core_function: str, log: list, flush: Callable
) -> list[str]:
    sources_text, sources_count, source_names = _sources_info(model_in, "primary_duties")
    entry: dict = {
        "agent": "Primary Duties",
        "stage": 2,
        "context": {"core_function": core_function},
        "sources_count": sources_count,
        "sources": source_names,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    log.append(entry)
    flush()

    t0 = time.time()
    prompt = (
        f"For {model_in.office} in {model_in.government_unit}, identify all Primary Duties for the core function: {core_function}\n\n"
        f"Primary Duties: {COLUMN_DEFINITIONS['Primary Duties']}\n\n"
        f"{sources_text}\n\n"
        f"Return ONLY a JSON array of strings, one per primary duty. Example: "
        f'["Issue licenses", "Process applications", "Maintain records"]'
    )
    response = _call_llm(prompt, "You are an expert in government operations and statutory duties.")
    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse primary duties: {response}")
        result = []

    entry.update({
        "status": "completed",
        "duration_ms": int((time.time() - t0) * 1000),
        "output": result,
    })
    flush()
    return result


def _get_transactions(
    model_in: GovernanceModelCreate, core_function: str, primary_duty: str, log: list, flush: Callable
) -> list[dict]:
    sources_text, sources_count, source_names = _sources_info(model_in, "transactions")
    entry: dict = {
        "agent": "Transactions",
        "stage": 3,
        "context": {"core_function": core_function, "primary_duty": primary_duty},
        "sources_count": sources_count,
        "sources": source_names,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    log.append(entry)
    flush()

    t0 = time.time()
    prompt = (
        f"For {model_in.office} in {model_in.government_unit}, identify all Transactions for:\n"
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
        result = json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse transactions: {response}")
        result = []

    entry.update({
        "status": "completed",
        "duration_ms": int((time.time() - t0) * 1000),
        "output": result,
    })
    flush()
    return result


def _get_personal_data_info(
    model_in: GovernanceModelCreate,
    core_function: str,
    primary_duty: str,
    transaction: str,
    related_records: str,
    log: list,
    flush: Callable,
) -> dict:
    sources_text, sources_count, source_names = _sources_info(model_in, "personal_data")
    entry: dict = {
        "agent": "Personal Data",
        "stage": 4,
        "context": {"core_function": core_function, "primary_duty": primary_duty, "transaction": transaction},
        "sources_count": sources_count,
        "sources": source_names,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    log.append(entry)
    flush()

    t0 = time.time()
    prompt = (
        f"For {model_in.office} in {model_in.government_unit}:\n"
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
        result = json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse personal data info: {response}")
        result = {}

    entry.update({
        "status": "completed",
        "duration_ms": int((time.time() - t0) * 1000),
        "output": result,
    })
    flush()
    return result


def _get_retention_info(
    model_in: GovernanceModelCreate,
    core_function: str,
    primary_duty: str,
    transaction: str,
    related_records: str,
    log: list,
    flush: Callable,
) -> dict:
    sources_text, sources_count, source_names = _sources_info(model_in, "retention")
    entry: dict = {
        "agent": "Retention",
        "stage": 5,
        "context": {"core_function": core_function, "primary_duty": primary_duty, "transaction": transaction},
        "sources_count": sources_count,
        "sources": source_names,
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    log.append(entry)
    flush()

    t0 = time.time()
    prompt = (
        f"For {model_in.office} in {model_in.government_unit}:\n"
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
        result = json.loads(response)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse retention info: {response}")
        result = {}

    entry.update({
        "status": "completed",
        "duration_ms": int((time.time() - t0) * 1000),
        "output": result,
    })
    flush()
    return result


@router.get("/log")
def get_run_log(
    *,
    current_user: CurrentUser,
    government_unit: str = Query(...),
    office: str = Query(...),
) -> Any:
    key = _log_key(government_unit, office)
    log_file = RUNS_DIR / f"{key}.json"
    if not log_file.exists():
        raise HTTPException(status_code=404, detail="No log found for this government unit and office")
    with open(log_file) as f:
        return json.load(f)


@router.post("/")
def create_governance_model(
    *, session: SessionDep, current_user: CurrentUser, model_in: GovernanceModelCreate
) -> Any:
    """
    Create a governance model using a multi-agent orchestration approach.
    """
    logger.info(f"Starting governance model generation for {model_in.office} in {model_in.government_unit}")

    t_start = time.time()
    started_at = datetime.now(timezone.utc).isoformat()
    run_log: list = []
    rows: list = []

    key = _log_key(model_in.government_unit, model_in.office)
    log_file = RUNS_DIR / f"{key}.json"
    _lock = threading.Lock()

    def flush(status: str = "running") -> None:
        payload = {
            "government_unit": model_in.government_unit,
            "office": model_in.office,
            "generated_at": started_at,
            "duration_ms": int((time.time() - t_start) * 1000),
            "rows_generated": len(rows),
            "status": status,
            "agents": list(run_log),
        }
        with _lock:
            with open(log_file, "w") as f:
                json.dump(payload, f, indent=2)

    def log_pipeline(message: str, t0: float) -> None:
        """Append a pipeline/orchestration entry capturing overhead time."""
        gap_ms = int((time.time() - t0) * 1000)
        entry: dict = {
            "agent": "Pipeline",
            "stage": 0,
            "context": {},
            "sources_count": 0,
            "sources": [],
            "status": "completed",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "duration_ms": gap_ms,
            "output": message,
        }
        run_log.append(entry)
        flush()

    # Stage 1: Core Functions
    t0 = time.time()
    core_functions = _get_core_functions(model_in, run_log, flush)
    log_pipeline(f"Found {len(core_functions)} core function{'s' if len(core_functions) != 1 else ''}. Starting pipeline.", t0)

    # Stages 2–5: For each core function → duties → transactions → parallel data/retention
    for cf_idx, cf in enumerate(core_functions):
        t0 = time.time()
        primary_duties = _get_primary_duties(model_in, cf, run_log, flush)
        log_pipeline(
            f"Core function {cf_idx + 1}/{len(core_functions)} — \"{cf}\": found {len(primary_duties)} primary dut{'y' if len(primary_duties) == 1 else 'ies'}.",
            t0,
        )

        for pd_idx, pd in enumerate(primary_duties):
            t0 = time.time()
            transactions = _get_transactions(model_in, cf, pd, run_log, flush)
            log_pipeline(
                f"Primary duty {pd_idx + 1}/{len(primary_duties)} — \"{pd}\": found {len(transactions)} transaction{'s' if len(transactions) != 1 else ''}.",
                t0,
            )

            for trans_idx, trans_obj in enumerate(transactions):
                transaction = trans_obj.get("transaction", "")
                related_records = trans_obj.get("related_records", "")

                t0 = time.time()
                with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
                    personal_data_future = executor.submit(
                        _get_personal_data_info,
                        model_in, cf, pd, transaction, related_records, run_log, flush
                    )
                    retention_future = executor.submit(
                        _get_retention_info,
                        model_in, cf, pd, transaction, related_records, run_log, flush
                    )
                    personal_data_info = personal_data_future.result()
                    retention_info = retention_future.result()

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
                log_pipeline(
                    f"Transaction {trans_idx + 1}/{len(transactions)} — \"{transaction[:60]}\": row assembled.",
                    t0,
                )

    flush("completed")
    logger.info(f"Wrote run log to {key}.json ({len(run_log)} agent calls)")

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
