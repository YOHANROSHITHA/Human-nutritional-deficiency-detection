import json
import subprocess
import base64
import os

def test_predict_text():
    print("--- Testing Text Prediction ---")
    symptoms = "I feel very tired and have muscle weakness and brain fog"
    cmd = ['python', 'backend/ml_model.py', 'predict-text', json.dumps({"symptoms": symptoms})]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print("Output:", result.stdout)
    else:
        print("Error:", result.stderr)

def test_predict_image():
    print("\n--- Testing Image Prediction (Mocking with empty base64) ---")
    # This will likely fail or give a random prediction if we don't have a real image,
    # but we want to see if the model loads and the script runs.
    # I'll create a dummy black image to test the pipeline.
    from PIL import Image
    import io
    img = Image.new('RGB', (224, 224), color = (0, 0, 0))
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    cmd = ['python', 'backend/ml_model.py', 'predict-image', img_str]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print("Output:", result.stdout)
    else:
        print("Error:", result.stderr)

if __name__ == "__main__":
    test_predict_text()
    test_predict_image()
