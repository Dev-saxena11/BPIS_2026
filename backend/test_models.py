import google.generativeai as genai

genai.configure(api_key="AIzaSyBoTSaqd5nCUfVrRxOWBAqGR6iMTg1lklM")
try:
    print("Available Models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    import traceback
    traceback.print_exc()
