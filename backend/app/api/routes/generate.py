import json
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(prefix="/generate", tags=["generate"])


class ReferenceInput(BaseModel):
    name: str
    url: str
    category: str
    governmentUnit: str


class GenerateRequest(BaseModel):
    state: str
    governmentType: str
    governmentUnit: str
    office: str
    coreFunction: str | None = None
    references: list[ReferenceInput] = []


SYSTEM_PROMPT = """You are a government records management expert. Generate realistic data governance model records for a government unit.

Return a JSON object with this exact structure:
{
  "coreFunctions": [
    {
      "name": "string - name of the core function (e.g. 'Elections administration', 'Voter registration')",
      "transactions": [
        {
          "primaryDuties": "string - primary duty this transaction belongs to",
          "transactions": "string - specific transaction name",
          "relatedRecords": "string - what records are created/used",
          "personalData": "string - types of personal data in the records",
          "useOfPersonalData": "string - how the personal data is used",
          "purposeOfProcessing": "string - purpose of processing personal data",
          "statutoryAuthorization": "string - legal authority (cite specific code sections)",
          "valueOfRecords": "string - administrative/legal/historical value",
          "primaryClassification": "string - e.g. 'public', 'protected', 'private', 'controlled'",
          "secondaryClassification": "string - secondary classification if applicable",
          "retentionDisposition": "string - retention period and destruction instructions",
          "generalRetentionSchedule": "string - retention schedule reference code"
        }
      ]
    }
  ]
}

Generate 2-4 core functions with 3-5 transactions each. Use realistic government terminology and cite real Utah Code sections where applicable. Base classifications on GRAMA (Utah Code Title 63G Chapter 2)."""


def build_user_prompt(req: GenerateRequest) -> str:
    ref_lines = ""
    if req.references:
        ref_lines = "\n\nRelevant references to cite:\n" + "\n".join(
            f"- [{r.category}] {r.name}: {r.url}" for r in req.references
        )

    cf_hint = f"\nFocus specifically on the core function: {req.coreFunction}" if req.coreFunction else ""

    return f"""Generate a data governance model for:
- State: {req.state}
- Government Type: {req.governmentType}
- Government Unit: {req.governmentUnit}
- Office: {req.office}{cf_hint}{ref_lines}

Generate realistic governance records appropriate for this type of government unit and office."""


@router.post("/")
def generate_model(req: GenerateRequest) -> Any:
    if not settings.OPENAI_KEY:
        raise HTTPException(status_code=503, detail="OpenAI key not configured")

    client = OpenAI(api_key=settings.OPENAI_KEY)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(req)},
            ],
            temperature=0.7,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {str(e)}")

    raw = response.choices[0].message.content or "{}"
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Invalid JSON from OpenAI")

    core_functions = []
    for cf in data.get("coreFunctions", []):
        cf_id = str(uuid.uuid4())
        transactions = []
        for tx in cf.get("transactions", []):
            transactions.append({
                "id": str(uuid.uuid4()),
                "primaryDuties": tx.get("primaryDuties", ""),
                "transactions": tx.get("transactions", ""),
                "relatedRecords": tx.get("relatedRecords", ""),
                "personalData": tx.get("personalData", ""),
                "useOfPersonalData": tx.get("useOfPersonalData", ""),
                "purposeOfProcessing": tx.get("purposeOfProcessing", ""),
                "statutoryAuthorization": tx.get("statutoryAuthorization", ""),
                "valueOfRecords": tx.get("valueOfRecords", ""),
                "primaryClassification": tx.get("primaryClassification", ""),
                "secondaryClassification": tx.get("secondaryClassification", ""),
                "authorityForProcessing": tx.get("authorityForProcessing", ""),
                "retentionPeriod": tx.get("retentionPeriod", ""),
                "retentionDisposition": tx.get("retentionDisposition", ""),
                "generalRetentionSchedule": tx.get("generalRetentionSchedule", ""),
                "status": "pending",
            })
        core_functions.append({
            "id": cf_id,
            "name": cf.get("name", ""),
            "transactions": transactions,
        })

    return {
        "id": str(uuid.uuid4()),
        "governmentUnit": req.governmentUnit,
        "office": req.office,
        "coreFunctions": core_functions,
        "approved": False,
        "lastUpdate": "2026-06-18",
        "owner": "Generated",
    }
