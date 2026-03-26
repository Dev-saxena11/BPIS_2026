import json
import urllib.request
from app.services.data_service import load_district_data

try:
    from services.scheme_engine import SCHEME_DATABASE
except ImportError:
    try:
        from services.scheme_engine import SCHEME_DATABASE
    except ImportError:
        SCHEME_DATABASE = {}

GEMINI_API_KEY = "AIzaSyDewmTRylsxAl5GXe0N-eyS66jEkfNJIk8"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

def get_chatbot_response(user_query: str) -> str:
    # Load the district DataFrame
    df = load_district_data()
    
    query_lower = user_query.lower()
    
    # Check if a district name is in the query
    districts = df['district'].dropna().unique()
    
    found_district = None
    for district in districts:
        if str(district).lower() in query_lower:
            found_district = district
            break

    district_context = "General Indian Census Data"
    
    # Fallback response
    fallback_response = (
        "Hello! I am the Bharat Policy Intelligence Assistant (BPIA). "
        "You can ask me about specific districts to get a summary of their literacy and population. "
        "How can I help you navigate the BPIS dashboard today?"
    )

    if found_district:
        # Get district summary for context and fallback
        district_data = df[df['district'] == found_district].iloc[0]
        literacy = district_data.get('literacy_rate', 'N/A')
        population = district_data.get('population', 'N/A')
        
        # Round literacy if numeric
        if isinstance(literacy, (int, float)):
            literacy = f"{literacy:.2f}%"
            
        district_context = f"District {str(found_district).title()}: Population is {population}, Literacy Rate is {literacy}"
        
        fallback_response = (
            f"Here is the summary for {str(found_district).title()}:\n"
            f"- Population: {population}\n"
            f"- Literacy: {literacy}\n\n"
            "I could not connect to my AI core to provide further insights, but please refer to the dashboard for additional policy mapping."
        )

    # Construct the expert system prompt
    prompt = f"""You are the Bharat Policy Intelligence Assistant (BPIA).
    CONTEXT FROM DATABASE: {district_context}.
    USER QUERY: {user_query}.
    INSTRUCTIONS: Provide a professional, concise (3-4 sentences) response for a government official. If the data shows low literacy, suggest schemes like Samagra Shiksha or Padhna Likhna Abhiyan. If population is high, suggest infrastructure or health schemes like PMJAY. Always remain formal and data-driven."""

    try:
        # Call Gemini REST API via standard library urllib to avoid gRPC dependency issues
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(GEMINI_API_URL, data=data, headers={"Content-Type": "application/json"})
        
        with urllib.request.urlopen(req, timeout=5.0) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result["candidates"][0]["content"]["parts"][0]["text"]
            
    except Exception as e:
        print(f"Error calling Gemini REST API: {e}")
        return fallback_response
