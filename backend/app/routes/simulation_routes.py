import pandas as pd
from fastapi import APIRouter, Query
from app.services.scoring_service import compute_priority_scores
from app.services.simulation_service import simulate_education_investment

router = APIRouter()

@router.get("/simulate/education")
def simulate(increase: int = Query(...)):
    # 1. Get baseline (Before)
    df_baseline = pd.DataFrame(compute_priority_scores())
    
    # 2. Lock the Top 5 districts for 1:1 comparison
    top_districts_names = df_baseline.head(5)["district"].tolist()
    top_before = df_baseline[df_baseline["district"].isin(top_districts_names)].copy()

    # 3. Run simulation
    simulated_df = simulate_education_investment(df_baseline, increase)

    # 4. Get same districts (After)
    top_after = simulated_df[simulated_df["district"].isin(top_districts_names)].copy()
    
    # 5. Format for Recharts dual-bar display
    chart_data = []
    for name in top_districts_names:
        b_val = top_before[top_before["district"] == name].iloc[0]["priority_score"]
        a_val = top_after[top_after["district"] == name].iloc[0]["priority_score"]
        chart_data.append({
            "district": name,
            "before_score": round(b_val, 2),
            "after_score": round(a_val, 2)
        })

    return {
        "message": f"Simulated impact of {increase}% funding increase",
        "chart_data": chart_data
    }