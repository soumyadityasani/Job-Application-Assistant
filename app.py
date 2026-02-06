import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify
import requests
from prompts import OBJECTIVE_PROMPT
from prompts import SKILLS_PROMPT
from prompts import PROJECTS_PROMPT

app = Flask(__name__)

load_dotenv()

OLLAMA_URL = "https://ollama.com/api/chat"
MODEL_NAME = "gpt-oss:120b"
OLLAMA_API_KEY=os.getenv("OLLAMA_API_KEY")
HEADERS = {
    "Authorization": f"Bearer {OLLAMA_API_KEY}",
    "Content-Type": "application/json"
}

@app.route("/generate/objective", methods=["POST"])
def generate_objective():
    data = request.get_json()

    if not data or "objective" not in data:
        return jsonify({"error": "Objective text is required"}), 400

    raw_objective = data["objective"]
    prompt = OBJECTIVE_PROMPT.format(raw_objective=raw_objective)

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": raw_objective
            }
        ],
        "stream": False,
        "options":{
            "temperature":0.1,
            "top_p":0.9
        }
    }

    try:
        response = requests.post(OLLAMA_URL,headers=HEADERS, json=payload)
        response.raise_for_status()

        result = response.json()["message"]["content"]

        return jsonify({
            "professional_objective": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate/skills", methods=["POST"])
def generate_skills():
    data = request.get_json()

    if not data or "skills" not in data:
        return jsonify({"error": "Skills input is required"}), 400

    raw_skills = data["skills"]
    prompt = SKILLS_PROMPT.format(raw_skills=raw_skills)

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": raw_skills
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9
        }
    }

    try:
        response = requests.post(OLLAMA_URL, headers=HEADERS, json=payload)
        response.raise_for_status()

        result = response.json()["message"]["content"]

        return jsonify({
            "professional_objective": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate/projects", methods=["POST"])
def generate_projects():
    data = request.get_json()

    if not data or "projects" not in data:
        return jsonify({"error": "Projects input is required"}), 400

    raw_projects = data["projects"]
    prompt = PROJECTS_PROMPT.format(raw_projects=raw_projects)

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "top_p": 0.9
        }
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()

        result = response.json()["response"].strip()

        return jsonify({
            "professional_projects": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
