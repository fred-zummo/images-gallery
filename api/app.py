import os
import requests
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
DEBUG=bool(os.environ.get("DEBUG"))

print(DEBUG)

if not UNSPLASH_KEY:
  raise EnvironmentError("Required UNSPLASH_KEY missing from .env.local file")

app = Flask(__name__)
app.config["DEBUG"] = False
CORS(app)

@app.route("/new-image")
def new_image():
  word = request.args.get("query")
  headers = {
    "Authorization": "Client-ID " + UNSPLASH_KEY 
  }
  params = { "query" : word }
  response=requests.get(url=UNSPLASH_URL, headers=headers, params=params)
  data = response.json()
  return data

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5050)