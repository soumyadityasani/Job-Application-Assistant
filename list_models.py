# list_models.py
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# List available models
try:
    response = client.models.list()
    print("Available models:")
    print("=" * 60)

    for model in response.models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ Model Name: {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Version: {model.version}")
            print(f"  Description: {model.description[:100]}...")
            print("-" * 50)

except Exception as e:
    print(f"Error: {e}")