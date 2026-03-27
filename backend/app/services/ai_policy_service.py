import pandas as pd

from app.services.scheme_mapper import get_schemes_for_district
from app.services.scoring_service import compute_priority_scores

# compute_priority_scores returns list → converting to DataFrame for processing
df = pd.DataFrame(compute_priority_scores())


def analyze_query(query: str) -> str:
    query = query.lower()

    if "education" in query or "literacy" in query:
        return "education"

    elif "health" in query or "hospital" in query:
        return "health"

    elif "high priority" in query or "risk" in query:
        return "priority"

    return "general"


def get_districts_by_focus(focus: str):
    if focus == "education":
        filtered = df[df["literacy_rate"] < 65]
    elif focus == "health":
        filtered = df[df["population"] > 1_000_000]
    elif focus == "priority":
        filtered = df.sort_values(by="priority_score", ascending=False)
    else:
        filtered = df

    return filtered.sort_values(by="priority_score", ascending=False).head(5)


def generate_response(query: str) -> dict:
    focus = analyze_query(query)
    districts = get_districts_by_focus(focus)

    response = {
        "recommended_districts": [],
        # Values are translation keys — the frontend passes these through t()
        # so the UI renders in the currently active language (EN or HI).
        "reason": "",
        "supporting_data": [],
        "action": "",
        "recommended_schemes": [],
    }

    # Build district data — data keys (literacy_rate, population, etc.) are
    # never renamed; only display labels are localized on the frontend.
    for _, row in districts.iterrows():
        response["recommended_districts"].append(row["district"])

        response["supporting_data"].append({
            "district": row["district"],
            "literacy": round(row["literacy_rate"], 2),
            "population": int(row["population"]),
            "priority_score": round(row["priority_score"], 2),
        })

        response["recommended_schemes"].append({
            "district": row["district"],
            "schemes": get_schemes_for_district(row),
        })

    # -------------------------------------------------------------------
    # Reasoning: values are translation keys, not raw English sentences.
    # The frontend already does  t(result.reason) / t(result.action).
    # Keys that already existed in translations.json (education focus):
    #   "These districts have low literacy rates, indicating need for
    #    education intervention."  →  kept as-is (legacy key still works)
    # New short keys for other intents:
    # -------------------------------------------------------------------
    if focus == "education":
        response["reason"] = "These districts have low literacy rates, indicating need for education intervention."
        response["action"] = "Deploy education-focused schemes and improve school infrastructure."

    elif focus == "health":
        response["reason"] = "reason_health"
        response["action"] = "action_health"

    elif focus == "priority":
        response["reason"] = "reason_priority"
        response["action"] = "action_priority"

    else:
        response["reason"] = "reason_general"
        response["action"] = "action_general"

    return response