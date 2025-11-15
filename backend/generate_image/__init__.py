import os
import json
import logging
import azure.functions as func
import requests

# Legge le variabili d'ambiente
AZURE_OPENAI_ENDPOINT = os.getenv("Azure_endpoint")
AZURE_OPENAI_DEPLOYMENT = os.getenv("Azure_deployment")
AZURE_API_KEY = os.getenv("Azure_api_key")

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Richiesta di generazione immagine ricevuta")

    try:
        body = req.get_json()
        prompt = body.get("prompt", "")
        if not prompt:
            return func.HttpResponse(
                json.dumps({"error": "Prompt mancante"}),
                status_code=400,
                mimetype="application/json"
            )

        # Endpoint API DALL·E
        url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/images/generations?api-version=2024-02-01"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AZURE_API_KEY}"
        }

        payload = {
            "model": "dall-e-3",
            "prompt": prompt,
            "size": "1024x1024",
            "n": 1
        }

        response = requests.post(url, headers=headers, json=payload)
        logging.info(f"Status code API: {response.status_code}")
        logging.info(f"Response API: {response.text}")

        if response.status_code != 200:
            return func.HttpResponse(
                json.dumps({"error": f"Errore API: {response.text}"}),
                status_code=response.status_code,
                mimetype="application/json"
            )

        data = response.json()
        image_url = data["data"][0]["url"]

        return func.HttpResponse(
            json.dumps({"url": image_url}),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        logging.error(f"Errore generazione: {e}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
