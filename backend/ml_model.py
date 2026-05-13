import sys
import json
import base64
import pickle
import os
from pathlib import Path
import io
import numpy as np
from PIL import Image

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

# Load model and any required assets
BASE_DIR = Path(__file__).parent.parent
MODEL_PATH = BASE_DIR / 'ml_microservice' / 'models' / 'model.pkl'
TEXT_MODEL_PATH = BASE_DIR / 'ml_microservice' / 'models' / 'text_model.pkl'

def load_pickle(path):
    if not path.is_file():
        return None
    with open(path, 'rb') as f:
        return pickle.load(f)

# Global model variables
image_model = None
text_model = None

def get_image_model():
    global image_model
    if image_model is not None:
        return image_model
    
    if MODEL_PATH.is_file():
        try:
            image_model = load_pickle(MODEL_PATH)
        except Exception as e:
            sys.stderr.write(f"Error loading image model: {e}\n")
    return image_model

def get_text_model():
    global text_model
    if text_model is not None:
        return text_model
    
    if TEXT_MODEL_PATH.is_file():
        try:
            text_model = load_pickle(TEXT_MODEL_PATH)
        except Exception as e:
            sys.stderr.write(f"Error loading text model: {e}\n")
    return text_model

# Image Classes
IMAGE_CLASSES = ['calcium', 'iodine', 'iron', 'vitamin_a', 'vitamin_b', 'vitamin_c', 'zinc']

def predict_image(image_base64: str):
    model = get_image_model()
    if model is None:
        raise Exception(f"Failed to load image model from {MODEL_PATH}")

    # Decode image
    img_bytes = base64.b64decode(image_base64)
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    
    # Preprocess
    img = img.resize((224, 224)) 
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Real inference
    predictions = model.predict(img_array, verbose=0)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx])

    if class_idx < len(IMAGE_CLASSES):
        label_key = IMAGE_CLASSES[class_idx]
    else:
        label_key = "unknown"

    return {"labelKey": str(label_key), "confidence": confidence}

def predict_text(symptoms: str):
    model = get_text_model()
    if model is None:
        raise Exception(f"Failed to load text model from {TEXT_MODEL_PATH}")
    
    # Predict
    prediction = model.predict([symptoms])[0]
    
    # Try to get probability
    try:
        probabilities = model.predict_proba([symptoms])[0]
        confidence = float(np.max(probabilities))
    except:
        confidence = 1.0

    # Normalize label
    label_key = prediction.lower().replace(" ", "_")
    
    return {"labelKey": label_key, "confidence": confidence, "labelDisplay": prediction}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
    
    command = sys.argv[1]
    result = {}

    try:
        # Read data from stdin (for large inputs like base64 images)
        input_data = sys.stdin.read().strip()

        if command == 'predict-image':
            if not input_data:
                raise Exception("No image data received via stdin")
            result = predict_image(input_data)
        elif command == 'predict-text':
            if not input_data:
                raise Exception("No text data received via stdin")
            try:
                data = json.loads(input_data)
                symptoms = data.get('symptoms', '')
            except:
                symptoms = input_data
            result = predict_text(symptoms)
        else:
            result = {"error": "Invalid command"}
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

    print(json.dumps(result))

if __name__ == '__main__':
    main()
