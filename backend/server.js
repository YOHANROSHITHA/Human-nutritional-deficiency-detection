import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nutriguard';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const FOODS_PATH = path.join(__dirname, 'data', 'foods.json');

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Prediction Schema
const predictionSchema = new mongoose.Schema({
  userEmail: { type: String, default: 'anonymous' },
  deficiency: String,
  confidence: String,
  foods: [String],
  advice: String,
  source: String,
  type: { type: String, enum: ['image', 'text'] },
  createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

const LABELS = {
  vitamin_a: 'Vitamin A',
  vitamin_b: 'Vitamin B',
  vitamin_b12: 'Vitamin B12',
  vitamin_c: 'Vitamin C',
  vitamin_d: 'Vitamin D',
  vitamin_e: 'Vitamin E',
  vitamin_k: 'Vitamin K',
  iron: 'Iron',
  zinc: 'Zinc',
  calcium: 'Calcium',
  iodine: 'Iodine',
  magnesium: 'Magnesium',
  potassium: 'Potassium',
  selenium: 'Selenium'
};

const ADVICE_MAPPING = {
  vitamin_a: 'Maintain good eye health and immune function. Focus on orange and leafy green vegetables.',
  vitamin_b: 'Support energy levels and brain function. Include whole grains and lean proteins.',
  vitamin_b12: 'Essential for nerve tissue and red blood cells. Primarily found in animal products.',
  vitamin_c: 'Boost immunity and skin health. Consume citrus fruits and fresh vegetables.',
  vitamin_d: 'Crucial for bone health and mood. Try to get safe sun exposure along with diet.',
  vitamin_e: 'Potent antioxidant for skin and eyes. Found in healthy oils and nuts.',
  vitamin_k: 'Important for blood clotting and bone health. Focus on green leafy vegetables.',
  iron: 'Prevent anemia and fatigue. Combine iron-rich foods with Vitamin C for better absorption.',
  zinc: 'Support wound healing and immunity. Include seeds, nuts, and dairy.',
  calcium: 'Strengthen bones and teeth. Ensure adequate Vitamin D intake for absorption.',
  iodine: 'Support thyroid health. Use iodized salt and consume seafood.',
  magnesium: 'Improve muscle function and sleep. Include seeds and leafy greens.',
  potassium: 'Regulate blood pressure and fluid balance. Focus on fruits like bananas.',
  selenium: 'Support thyroid and heart health. A few Brazil nuts daily can help.'
};

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload.' });
  }
  return next(err);
});

let foodsCache = null;

const loadFoods = async () => {
  if (foodsCache) return foodsCache;
  try {
    const raw = await fs.readFile(FOODS_PATH, 'utf-8');
    foodsCache = JSON.parse(raw);
  } catch {
    foodsCache = {};
  }
  return foodsCache;
};

const buildResponse = async ({ labelKey, labelDisplay, confidence, source, type }) => {
  const foodsDb = await loadFoods();
  const safeKey = labelKey || 'unknown';
  const display = LABELS[safeKey] || labelDisplay || 'Unknown';

  const advice = ADVICE_MAPPING[safeKey] || `Consider increasing ${display} rich foods and consult a healthcare professional for personalized guidance.`;

  return {
    deficiency: display,
    confidence: Number.isFinite(confidence) ? (confidence * 100).toFixed(1) + '%' : (confidence || 'N/A'),
    foods: foodsDb[safeKey] || [],
    advice,
    nutrientKey: safeKey,
    source: source || (labelKey === 'unknown' ? 'Fallback' : 'AI Engine'),
    type: type || 'image'
  };
};

app.post('/api/predict-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    let mlResult;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-image`, {
        image_base64: imageBase64
      }, { timeout: 15000 });
      mlResult = { ...mlResponse.data, source: 'ML Microservice' };
    } catch (httpError) {
      console.warn('ML Microservice unreachable, falling back to process spawning...', httpError.message);
      const python = spawn('python', ['ml_model.py', 'predict-image']);
      let data = '';
      let errorData = '';
      python.on('error', (err) => { console.error('Failed to start Python process:', err); });
      const timeout = setTimeout(() => { python.kill(); }, 30000);
      if (python.stdin) {
        python.stdin.on('error', (err) => { console.error('Stdin Error:', err); });
        python.stdin.write(imageBase64);
        python.stdin.end();
      }
      python.stdout.on('data', (chunk) => { data += chunk; });
      python.stderr.on('data', (chunk) => { errorData += chunk; });
      await new Promise((resolve) => python.on('close', resolve));
      clearTimeout(timeout);
      if (data) { mlResult = { ...JSON.parse(data), source: 'Spawn Fallback' }; }
      else { throw new Error('No data from Python process'); }
    }

    const payload = await buildResponse({ ...mlResult, type: 'image' });

    // Save to MongoDB
    try {
      await new Prediction({
        ...payload,
        type: 'image',
        userEmail: req.body.email || 'anonymous'
      }).save();
    } catch (dbErr) {
      console.error('Database Save Error:', dbErr);
    }

    return res.json(payload);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Internal server error during analysis.' });
  }
});

app.post('/api/predict-text', async (req, res) => {
  try {
    const { symptoms } = req.body || {};
    if (!symptoms || symptoms.trim().length < 5) {
      return res.status(400).json({ message: 'Symptoms input is too short.' });
    }

    let mlResult;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-text`, {
        symptoms
      }, { timeout: 10000 });
      mlResult = { ...mlResponse.data, source: 'ML Microservice' };
    } catch (httpError) {
      console.warn('ML Microservice unreachable, falling back to process spawning...', httpError.message);
      const python = spawn('python', ['ml_model.py', 'predict-text']);
      let data = '';
      let errorData = '';
      python.on('error', (err) => { console.error('Failed to start Python process:', err); });
      if (python.stdin) {
        python.stdin.on('error', (err) => { console.error('Stdin Error:', err); });
        python.stdin.write(JSON.stringify({ symptoms }));
        python.stdin.end();
      }
      python.stdout.on('data', (chunk) => { data += chunk; });
      python.stderr.on('data', (chunk) => { errorData += chunk; });
      await new Promise((resolve) => python.on('close', resolve));
      if (data) { mlResult = { ...JSON.parse(data), source: 'Spawn Fallback' }; }
      else { throw new Error('No data from Python process'); }
    }

    const payload = await buildResponse({ ...mlResult, type: 'text' });

    // Save to MongoDB
    try {
      await new Prediction({
        ...payload,
        type: 'text',
        userEmail: req.body.email || 'anonymous'
      }).save();
    } catch (dbErr) {
      console.error('Database Save Error:', dbErr);
    }

    return res.json(payload);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Failed to analyze symptoms.' });
  }
});


app.get('/api/foods/:nutrientKey', async (req, res) => {
  const foodsDb = await loadFoods();
  const foods = foodsDb[req.params.nutrientKey] || [];
  return res.json({ foods });
});

app.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
