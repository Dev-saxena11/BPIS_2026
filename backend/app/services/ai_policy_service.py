import pandas as pd

from app.services.scheme_mapper import get_schemes_for_district
from app.services.scoring_service import compute_priority_scores
# compute_priority_scores returns list → converting to DataFrame for processing
df = pd.DataFrame(compute_priority_scores())



def analyze_query(query: str):
    query = query.lower()

    # Detect intent
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
        filtered = df[df["population"] > 1000000]

    elif focus == "priority":
        filtered = df.sort_values(by="priority_score", ascending=False)

    else:
        filtered = df

    return filtered.sort_values(by="priority_score", ascending=False).head(5)


def generate_response(query: str):

    focus = analyze_query(query)
    districts = get_districts_by_focus(focus)

    response = {
        "recommended_districts": [],
        "reason": "",
        "supporting_data": [],
        "action": ""
    }

    # Build response
    for _, row in districts.iterrows():

        response["recommended_districts"].append(row["district"])

        response["supporting_data"].append({
            "district": row["district"],
            "literacy": row["literacy_rate"],
            "population": row["population"],
            "priority_score": row["priority_score"]
        })
            # Add scheme recommendations per district
        if "recommended_schemes" not in response:
            response["recommended_schemes"] = []

        response["recommended_schemes"].append({
            "district": row["district"],
            "schemes": get_schemes_for_district(row)
        })

    # Reasoning
    if focus == "education":
        response["reason"] = "These districts have low literacy rates, indicating need for education intervention."
        response["action"] = "Deploy education-focused schemes and improve school infrastructure."

    elif focus == "health":
        response["reason"] = "These districts have high population pressure, indicating healthcare demand."
        response["action"] = "Strengthen healthcare services and expand hospital coverage."

    elif focus == "priority":
        response["reason"] = "These districts have highest priority scores based on socio-economic indicators."
        response["action"] = "Focus immediate policy attention and resource allocation."

    else:
        response["reason"] = "General high-priority districts based on overall indicators."
        response["action"] = "Monitor and allocate resources accordingly."

    return response