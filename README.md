# BPIS_2026
# Bharat Policy Intelligence System (BPIS)
BPIS is an AI-powered Decision Support System designed for government officials to identify socio-economic gaps in Indian districts and simulate the impact of policy interventions.
## 🚀 Key Features
• Priority Scoring Engine: Automatically ranks 600+ districts using a multi-factor weighted formula (Literacy Gap + Population Pressure).
• AI Policy Advisor: Natural Language interface that detects intent (Health, Education, Infrastructure) and provides specific district recommendations.
• Policy Impact Simulator: A "What-If" engine that simulates literacy rate improvements and visualizes the resulting reduction in a district's priority/risk score.
• Interactive GIS Map: Geospatial visualization of high-priority zones with real-time scheme recommendations upon district selection.
• Scheme Mapping: Automatically matches districts to central government schemes like Samagra Shiksha Abhiyan or PM Jan Arogya Yojana based on real-time data analysis.
## 🛠️ Tech Stack
Frontend:React.js: For a dynamic, responsive dashboard.
Recharts: Data visualization and policy impact comparison charts.Leaflet / React-Leaflet: Geospatial mapping of Indian districts.
Axios: Seamless API communication.
Backend:FastAPI (Python): High-performance asynchronous API framework.Pandas: Robust data processing and simulation logic.
Uvicorn: ASGI server for deployment.
## 📂 Project Structure
├── app/
│   ├── routes/          # API Endpoints (Simulation, AI, Analytics)
│   ├── services/        # Core Logic (Scoring, Scheme Mapping, Data Loading)
├── data/
│   ├── processed/       # Indian Census 2011 Master Dataset
├── src/
│   ├── components/      # React UI Components (Charts, Maps, Advisor)
│   ├── services/        # Frontend API Service

## 🚦 Getting Started
1. Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
Backend runs on: http://localhost:8000
2. Frontend Setup
cd frontend
npm install
npm start
Frontend runs on: http://localhost:3000
## 📊 The Policy Formula
The system calculates the Priority Score using the following standardized logic:
### Priority_Score = (100 - Literacy_Rate) * 0.8 + (Population * 0.00001)
A higher score indicates a more urgent need for government intervention.