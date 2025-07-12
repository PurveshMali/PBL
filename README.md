# SO₂ Emission Prediction Web Application

A team-based machine learning web application designed to predict sulfur dioxide (SO₂) emissions from coal-based power plants in India. The model utilizes operational and environmental parameters to provide real-time emission estimates, supporting cleaner energy practices and compliance evaluation.

## 🚀 Features

- 🔍 ML-based prediction using XGBoost
- ⚙️ Hyperparameter optimization with Optuna
- 🌐 RESTful API built with FastAPI
- 📦 Dockerized for cross-platform deployment
- 🧩 Modular codebase with logging and validation
- 💻 Frontend integration (HTML/CSS/JS)

## 📊 Model Overview

- **Model Used:** XGBoost Regressor
- **Tuning:** Optuna
- **Inputs:** Calorific value, thermal efficiency, CO₂ levels, and more
- **Output:** Predicted SO₂ emission (in mg/Nm³)

## 🛠️ Tech Stack

- Python
- FastAPI
- XGBoost
- Optuna
- Docker
- HTML, CSS, JavaScript (for UI)

## 📦 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/PurveshMali/PBL
cd PBL

# Build and run using Docker
docker build -t so2-predictor .
docker run -p 8000:8000 so2-predictor

# Visit the app at:
http://localhost:8000/docs
