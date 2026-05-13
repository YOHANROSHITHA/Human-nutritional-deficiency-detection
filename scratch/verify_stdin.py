import subprocess
import json
import base64
from PIL import Image
import io

def test_predict_text_stdin():
    print("--- Testing Text Prediction via Stdin ---")
    symptoms = "I feel very tired and have muscle weakness"
    input_str = json.dumps({"symptoms": symptoms})
    
    process = subprocess.Popen(['python', 'backend/ml_model.py', 'predict-text'], 
                             stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate(input=input_str)
    
    if process.returncode == 0:
        print("Output:", stdout)
    else:
        print("Error:", stderr)

def test_predict_image_stdin():
    print("\n--- Testing Image Prediction via Stdin ---")
    img = Image.new('RGB', (224, 224), color = (255, 0, 0)) # Red image
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    process = subprocess.Popen(['python', 'backend/ml_model.py', 'predict-image'], 
                             stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate(input=img_str)
    
    if process.returncode == 0:
        print("Output:", stdout)
    else:
        print("Error:", stderr)

if __name__ == "__main__":
    test_predict_text_stdin()
    test_predict_image_stdin()
