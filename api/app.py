import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from mongo_client import mongo_client

gallery = mongo_client.gallery
images_collection = gallery.images

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.getenv('UNSPLASH_KEY', '')
DEBUG=os.getenv('DEBUG', 'False')

print(DEBUG)

if not UNSPLASH_KEY:
  raise EnvironmentError("Required UNSPLASH_KEY missing from .env.local file")

app = Flask(__name__)

if (DEBUG == 'True'):
  app.config["DEBUG"] = True
else:
  app.config["BEBUG"] = False

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

@app.route("/images", methods=["GET", "POST"])
def images():
  if request.method == "GET":
    # read images from the db
    images = images_collection.find({})
    return jsonify([img for img in images])
  if request.method == "POST":
    # save image in the db
    image = request.get_json()
    image["_id"] = image.get("id")
    result = images_collection.insert_one(image)
    inserted_id = result.inserted_id
    return {"inserted_id": inserted_id}

@app.route("/images/<image_id>", methods=["DELETE"])
def del_image(image_id):
  if request.method == "DELETE":
    # delete image from db
    my_query = { "_id": image_id }
    result = images_collection.delete_one(my_query)
    if (result):
      if (result.deleted_count == 1):
        return {"deleted_id": image_id}
      else:
        return {"error": "Image not found"}, 404
    else:
      return {"error": "Image was not deleted. Please try again."}, 500

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5050)