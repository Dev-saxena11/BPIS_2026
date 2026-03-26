import google.generativeai as genai
import traceback

try:
    genai.configure(api_key="AIzaSyBoTSaqd5nCUfVrRxOWBAqGR6iMTg1lklM")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    print("SUCCESS")
    print(response.text)
except Exception as e:
    print("ERROR OCCURRED:")
    traceback.print_exc()
