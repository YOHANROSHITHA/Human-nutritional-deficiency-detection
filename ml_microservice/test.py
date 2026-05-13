import pickle

with open("./models/text_model.pkl",'rb') as f:
    text_model = pickle.load(f)
    
text = input("Enter symptoms: ")
pred = text_model.predict([text])  # ✅ correct
print(pred)
