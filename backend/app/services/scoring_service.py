from app.services.data_service import load_district_data

def compute_priority_scores():

    df = load_district_data()

    df["literacy_gap"] = 100 - df["literacy_rate"]
    df["gender_gap"] = abs(1000 - df["gender_ratio"])
    df["population_pressure"] = df["population_weight"] * 100

    df["priority_score"] = (
        0.4 * df["literacy_gap"] +
        0.3 * df["gender_gap"] +
        0.3 * df["population_pressure"]
    )

    df = df.sort_values(by="priority_score", ascending=False)

    return df[[
        "district",
        "state",
        "priority_score","literacy_rate","population"
    ]].to_dict(orient="records")