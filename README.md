# SO2 Emission Prediction Platform

This repository contains a full-stack dashboard for analyzing emissions and predicting plant-level SO2 output using real CSV data from the project workspace. The app combines a React dashboard, a Flask analytics API, a Node/Express auth service, and a Flask prediction service backed by a trained scikit-learn model.

## What's Included

- Premium React/Vite dashboard for overview, insights, impacts, settings, and predictions
- Real plant-level SO2 prediction model trained on the repository CSV data
- Express auth service with MongoDB integration and AI insights endpoint
- Flask analytics API for charts, state summaries, and totals
- In-depth project report in [MODEL_REPORT.md](MODEL_REPORT.md)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Auth service: Node.js, Express, MongoDB, JWT
- Analytics API: Python, Flask, pandas
- Prediction service: Python, Flask, scikit-learn, joblib
- AI integrations: Hugging Face and Gemini-powered insights endpoints

## Service Ports

- Frontend: `5173` by default
- Auth service: `3001`
- Analytics API: `5000`
- Prediction API: `8081`

## Local Setup

### 1. Install dependencies

```powershell
# Frontend
cd frontend
npm install

# Auth service
cd ..\Auth
npm install

# Python environment
cd ..
.\.venv\Scripts\Activate.ps1
pip install -r Backend\requirements.txt
pip install pandas numpy scikit-learn joblib python-dotenv google-generativeai openai
```

### 2. Configure environment variables

Create a root `.env` file with the values used by the services:

- `MONGO_URI` for the auth service
- `HF_API_KEY` for the Hugging Face insights endpoint
- `API_KEY` for the Gemini insights endpoint

### 3. Run the services

Open separate terminals and start each service from its own folder:

```powershell
# Auth service
cd Auth
node app.js

# Analytics API
cd Backend
python app.py

# Prediction API
cd Model
python so2_model.py

# Frontend
cd frontend
npm run dev
```

### 4. Open the app

- Frontend dashboard: `http://localhost:5173`
- Auth API: `http://localhost:3001`
- Analytics API: `http://localhost:5000`
- Prediction API: `http://localhost:8081`

## Project Notes

- The old synthetic SO2 flow was replaced with a real plant-level model.
- The prediction page now shows validation quality alongside the forecast result.
- The dashboard styling was upgraded to a consistent premium visual system.

## Interview Prep

The report file includes architecture notes, model details, edge cases, and interview questions you can use during project presentation.
