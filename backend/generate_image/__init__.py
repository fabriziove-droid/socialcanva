import os
import azure.functions as func
import json
import requests

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")  # la tua chiave Foundry

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        prompt = req_body.get("prompt")
        if not prompt:
            return func.HttpResponse(json.dumps({"error": "No prompt provided"}), status_code=400, mimetype="application/json")

        url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/images/generations?api-version=2025-04-01-preview"
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_API_KEY
        }
        body = {
            "model": AZURE_OPENAI_DEPLOYMENT,
            "prompt": prompt,
            "n": 3,
            "size": "1024x1536"  # verticale per reel
        }

        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        urls = [item["url"] for item in data.get("data", [])]

        return func.HttpResponse(json.dumps({"urls": urls}), status_code=200, mimetype="application/json")
    
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": str(e)}), status_code=500, mimetype="application/json")
