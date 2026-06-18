"""
Data sources and examples for governance model generation.

Structure: data_sources[government_unit][office][category] = [list of sources]
Categories: core_functions, primary_duties, transactions, personal_data, retention, examples
"""

data_sources = {
    "Utah County": {
        "Clerk": {
            "core_functions": [
                {
                    "cite": "Utah Code § 17-20-4",
                    "title": "Duties of county clerk",
                    "url": "https://law.justia.com/codes/utah/2024/title-17/chapter-20/section-4/",
                    "description": "Statutory responsibilities and core functions of the county clerk",
                }
            ],
            "primary_duties": [
                {
                    "cite": "Utah Code § 17-20-4",
                    "title": "Duties of county clerk",
                    "url": "https://law.justia.com/codes/utah/2024/title-17/chapter-20/section-4/",
                    "description": "Specific tasks and duties performed by the county clerk",
                }
            ],
            "transactions": [
                {
                    "cite": "Utah Code § 81-2-303",
                    "title": "Application for marriage license -- Contents",
                    "url": "https://le.utah.gov/xcode/Title81/Chapter2/81-2-S303.html",
                    "description": "Marriage license transactions and related records",
                }
            ],
            "personal_data": [
                {
                    "cite": "Utah Code § 81-2-303",
                    "title": "Application for marriage license -- Contents",
                    "url": "https://le.utah.gov/xcode/Title81/Chapter2/81-2-S303.html",
                    "description": "Personal data collected in marriage license applications",
                },
                {
                    "cite": "Utah Code § 63G-2-301",
                    "title": "Public records",
                    "url": "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S301.html",
                    "description": "Classification of public records and statutory authorization",
                },
                {
                    "cite": "Utah Code § 63G-2-302",
                    "title": "Private records",
                    "url": "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S302.html",
                    "description": "Classification of private records",
                },
                {
                    "cite": "Utah Code § 26B-8-125",
                    "title": "Inspection of vital records",
                    "url": "https://le.utah.gov/xcode/Title26B/Chapter8/26B-8-S125.html",
                    "description": "Restrictions on access to vital records and personal data",
                }
            ],
            "retention": [
                {
                    "cite": "Utah Code § 26B-8-125",
                    "title": "Inspection of vital records",
                    "url": "https://le.utah.gov/xcode/Title26B/Chapter8/26B-8-S125.html",
                    "description": "Retention requirements for vital records",
                },
                {
                    "cite": "Utah County Ordinance",
                    "title": "Government Records Access and Management",
                    "url": "https://drive.google.com/file/d/1Z0zI_JAKG1lYpyPT4Wc9L89WC0KEWIyH/view",
                    "description": "Local retention schedules and disposition",
                }
            ],
            "examples": [
                {
                    "description": "Marriage License model",
                    "core_function": "Marriage licenses",
                    "primary_duty": "Issue marriage licenses",
                    "transactions": [
                        "Process application and payment",
                        "Review couple's identity documents",
                        "Issue or deny marriage license"
                    ]
                },
                {
                    "description": "Marriage License model - recording",
                    "core_function": "Marriage licenses",
                    "primary_duty": "Record/register marriages",
                    "transactions": [
                        "Certify marriage",
                        "Record marriage",
                        "Register marriage"
                    ]
                }
            ]
        }
    }
}


def get_sources(government_unit: str, office: str, category: str) -> list[dict]:
    """
    Retrieve data sources for a specific government unit, office, and category.

    Args:
        government_unit: e.g., "Utah County"
        office: e.g., "Clerk"
        category: e.g., "core_functions", "personal_data", "retention", "examples"

    Returns:
        List of source dictionaries with cite, title, url, and description
    """
    try:
        return data_sources[government_unit][office][category]
    except KeyError:
        return []


def format_sources_for_prompt(sources: list[dict]) -> str:
    """Format sources as a readable string for inclusion in LLM prompts."""
    if not sources:
        return "No specific sources available."

    formatted = "Reference sources:\n"
    for source in sources:
        formatted += f"- {source.get('cite', 'N/A')}: {source.get('title', 'N/A')}\n"
        formatted += f"  URL: {source.get('url', 'N/A')}\n"
    return formatted
