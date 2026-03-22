from app.routes.scheme_routes import router as scheme_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.district_routes import router as district_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.scoring_routes import router as scoring_router
from app.routes.ai_policy_routes import router as ai_policy_router
from app.routes import simulation_routes


app = FastAPI(title="BPIS API")
#Enable CORS for all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "BPIS Backend Running"}


app.include_router(district_router)
app.include_router(analytics_router)
app.include_router(scoring_router)
app.include_router(scheme_router)
app.include_router(ai_policy_router)
app.include_router(simulation_routes.router)