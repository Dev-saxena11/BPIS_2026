from app.services.data_service import load_district_data

def calculate_priority_score(df):
    # Standardized formula for the entire app
    df["priority_score"] = (
        (100 - df["literacy_rate"]) * 0.8 +
        (df["population"] * 0.00001)
    )
    return df

def compute_priority_scores():
    df = load_district_data()
    df = calculate_priority_score(df)
    df = df.sort_values(by="priority_score", ascending=False)
    
    return df.to_dict(orient="records")