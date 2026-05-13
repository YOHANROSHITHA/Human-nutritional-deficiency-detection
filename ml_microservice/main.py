from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import pickle
import os
import base64
import io
import numpy as np
from PIL import Image
from pathlib import Path

app = FastAPI(title="Nutrient Deficiency ML Service")

# Paths
MODELS_DIR = Path(__file__).parent / "models"
IMAGE_MODEL_PATH = MODELS_DIR / "model.pkl"
TEXT_MODEL_PATH = MODELS_DIR / "text_model.pkl"

# Global model variables
image_model = None
text_model = None

# Image Classes
IMAGE_CLASSES = ['calcium', 'iodine', 'iron', 'vitamin_a', 'vitamin_b', 'vitamin_c', 'zinc']

def load_models():
    global image_model, text_model
    if IMAGE_MODEL_PATH.exists():
        with open(IMAGE_MODEL_PATH, 'rb') as f:
            image_model = pickle.load(f)
    if TEXT_MODEL_PATH.exists():
        with open(TEXT_MODEL_PATH, 'rb') as f:
            text_model = pickle.load(f)

@app.on_event("startup")
async def startup_event():
    load_models()

class Symptoms(BaseModel):
    symptoms: str

class ImageRequest(BaseModel):
    image_base64: str

@app.get("/")
def read_root():
    return {"status": "ok", "models_loaded": {"image": image_model is not None, "text": text_model is not None}}

@app.post("/predict-image")
async def predict_image_endpoint(request: ImageRequest):
    if image_model is None:
        raise HTTPException(status_code=500, detail="Image model not loaded")
    
    try:
        # Decode image
        img_bytes = base64.b64decode(request.image_base64)
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        
        # Preprocess
        img = img.resize((224, 224)) 
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = image_model.predict(img_array, verbose=0)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])

        label_key = IMAGE_CLASSES[class_idx] if class_idx < len(IMAGE_CLASSES) else "unknown"
        
        return {"labelKey": label_key, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict-text")
async def predict_text_endpoint(request: Symptoms):
    if text_model is None:
        raise HTTPException(status_code=500, detail="Text model not loaded")
    
    try:
        # Predict
        prediction = text_model.predict([request.symptoms])[0]
        
        # Try to get probability
        try:
            probabilities = text_model.predict_proba([request.symptoms])[0]
            confidence = float(np.max(probabilities))
        except:
            confidence = 1.0

        # Normalize label
        label_key = prediction.lower().replace(" ", "_")
        
        return {"labelKey": label_key, "confidence": confidence, "labelDisplay": prediction}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)