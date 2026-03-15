from fastapi import APIRouter
from app.services.data_service import load_district_data
from services.scheme_engine import recommend_schemes

router = APIRouter()

@router.get("/scheme-recommendation/{district_name}")
def scheme_recommendation(district_name: str):

    df = load_district_data()

    # Find district
    district_row = df[df["district"].str.lower() == district_name.lower()]
    
    if district_row.empty:
        return {"error": "District not found"}

    district_data = district_row.iloc[0].to_dict()

    result = recommend_schemes(district_data)

    return result