# test_api.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Try to list available models
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ Available: {model.name}")

    # Test a simple generation
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello")
    print(f"\nTest response: {response.text[:50]}...")
    print("✅ API is working!")

except Exception as e:
    print(f"❌ Error: {e}")