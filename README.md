🤖 Project Summary: Human Nutritional Deficiency Detection System

1. Project Overview

The Human Nutritional Deficiency Detection System is a comprehensive full-stack web application designed to help users identify potential nutritional deficiencies (such as Calcium, Iodine, Iron, and various Vitamins) using advanced Machine Learning techniques. The system provides two primary methods of detection: Physical Sign Analysis (via image classification) and Symptom Analysis (via natural language processing of user-reported symptoms).

2. Key Features

Image-Based Detection: Users can upload images of physical signs (e.g., eyes, skin, nails) to be analyzed by a Deep Learning model to identify specific nutrient deficiencies.
Symptom-Based Analysis: A text-based assessment tool where users describe their symptoms, which are then analyzed using a Machine Learning classifier.
User Authentication & Management: Secure login and signup system to manage user profiles and history.
Personalized Recommendations: Provides actionable advice and dietary suggestions based on the detected deficiency.
Real-time Results: High-performance architecture ensuring quick response times for ML inference.

3. Technical Stack

Frontend (UI/UX)

Framework		: React.js (v18)
Build Tool		: Vite (for highly optimized development and production bundles)
Styling			: Vanilla CSS & Tailwind CSS (implementing a modern, responsive "Glassmorphism" UI)
State Management	: React Hooks (UseState, UseEffect) and Context API
API Communication	: Axios with custom interceptors for robust error handling.

Backend (Server Side)

Runtime Environment	: Node.js (Asynchronous Event-driven architecture)
Web Framework		: Express.js (RESTful API design)
Database		: MongoDB (NoSQL) with Mongoose ODM for schema-based data modeling.
Security		: JWT (JSON Web Tokens) for stateless authentication and bcryptjs for secure credential hashing.
Microservice Integration: Dual-mode inference engine:
Primary			: REST communication with a dedicated FastAPI microservice.
Fallback		: Dynamic child process spawning for local Python execution, ensuring 100% availability.
File Processing		: Multer for efficient memory-buffer handling of image uploads.

Machine Learning & Data Science

Languages	: Python 3.x
Deep Learning	: TensorFlow/Keras for high-accuracy Image Classification (CNN).
NLP		: Scikit-Learn for text-based symptom classification using advanced vectorization techniques.
Data Handling	: NumPy and Pandas for numerical operations; Pillow (PIL) for image preprocessing (normalization 		and resizing).

4. Machine Learning Models
Physical Sign Detection (Vision Model)

Architecture: Convolutional Neural Network (CNN) optimized for feature extraction from physical biomarkers.
Input Specifications: 224x224 RGB image tensors.
Classification Scope: Detects critical deficiencies: Calcium, Iodine, Iron, Vitamin A, B, C, and Zinc.
Symptom Analysis (NLP Model):
Logic: Multi-class classification based on user-described symptoms.
Output: Predictive deficiency labels with associated confidence intervals.

5. System Architecture & Workflow
1.User Request: User provides data (image/text) via the React SPA.
2.Backend Processing: Node.js server receives the request, sanitizes inputs, and routes to the appropriate analysis engine.
3.Inference Pipeline: The server attempts to connect to the FastAPI Microservice. If the microservice is unavailable, the system automatically falls back to a Python-Bridge (Spawned process) to maintain service continuity.
4.Data Synthesis: Results are mapped against a specialized health-data repository (JSON-based) to extract specific food recommendations and clinical advice.
5.Persistence: Predictions are stored in MongoDB for historical tracking.
6.Result Delivery: Real-time feedback is provided to the user via a dynamic, interactive dashboard.

