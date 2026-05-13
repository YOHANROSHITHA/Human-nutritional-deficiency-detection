import pickle
import os

def inspect_model(path, name):
    if not os.path.exists(path):
        print(f"{name} not found at {path}")
        return
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        print(f"--- {name} ---")
        print(f"Type: {type(model)}")
        if hasattr(model, 'classes_'):
            print(f"Classes: {model.classes_}")
        elif hasattr(model, 'steps'):
            # Pipeline
            clf = model.steps[-1][1]
            if hasattr(clf, 'classes_'):
                print(f"Clf Classes: {clf.classes_}")
        else:
            print("No classes_ attribute found.")
    except Exception as e:
        print(f"Error loading {name}: {e}")

# Paths to models
image_model_path = r'c:\Users\ASUS\OneDrive\Desktop\Final_ProjectML\ml_microservice\models\model.pkl'
text_model_path = r'c:\Users\ASUS\OneDrive\Desktop\Final_ProjectML\ml_microservice\models\text_model.pkl'

inspect_model(image_model_path, "Image Model")
inspect_model(text_model_path, "Text Model")
