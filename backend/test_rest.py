import json
import urllib.request
import urllib.error

GEMINI_API_KEY = "AIzaSyBoTSaqd5nCUfVrRxOWBAqGR6iMTg1lklM"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

prompt = "Hello"
payload = {
    "contents": [{"parts": [{"text": prompt}]}]
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(GEMINI_API_URL, data=data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("SUCCESS:")
        print(result["candidates"][0]["content"]["parts"][0]["text"])
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} {e.reason}")
    print(e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URLError: {e.reason}")
except Exception as e:
    print(f"Other Error: {e}")
