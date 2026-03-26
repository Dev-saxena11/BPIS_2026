import os
from google import genai

try:
    client = genai.Client(api_key="AIzaSyBoTSaqd5nCUfVrRxOWBAqGR6iMTg1lklM")
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents='Tell me a very brief fact.'
    )
    print("SUCCESS")
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
