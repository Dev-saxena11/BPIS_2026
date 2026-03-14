import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_PATH = BASE_DIR / "data" / "processed" / "district_master_dataset.csv"
def load_district_data():
    df = pd.read_csv(DATA_PATH)
    return df

def get_all_districts():
    df = load_district_data()
    return df.to_dict(orient="records")