import pandas as pd
import numpy as np
import joblib
import os
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error
from xgboost import XGBRegressor
from prophet import Prophet

app = Flask(__name__)

MODEL_PATH = "./so2_trained_model_india.pkl"
DATA_PATH = "./so2_data_india.csv"

# -------------------------------
# 1. Data Generation & Preprocessing (Indian Standards)
# -------------------------------

def generate_data():
    """Generate synthetic SO₂ emission data based on Indian standards."""
    np.random.seed(42)

    # Date range (monthly from 2000 to 2023)
    dates = pd.date_range(start='2000-01-01', end='2023-12-31', freq='M')

    # Fuel types based on Indian power plants
    fuel_types = ['Domestic Coal', 'Imported Coal', 'Lignite', 'Natural Gas']
    regions = ['North', 'South', 'East', 'West']

    n_samples = 1000
    fuel_choice = np.random.choice(fuel_types, n_samples)

    energy_output = []
    so2_emissions = []
    fuel_cost = []

    for fuel in fuel_choice:
        if fuel == 'Domestic Coal':
            energy_output.append(np.random.uniform(300, 1500))
            so2_emissions.append(np.random.uniform(100, 600))  # Indian SO₂ norms (mg/Nm³)
            fuel_cost.append(np.random.uniform(2000, 5000))  # INR per ton
        elif fuel == 'Imported Coal':
            energy_output.append(np.random.uniform(500, 2000))
            so2_emissions.append(np.random.uniform(50, 300))
            fuel_cost.append(np.random.uniform(3000, 7000))
        elif fuel == 'Lignite':
            energy_output.append(np.random.uniform(200, 1000))
            so2_emissions.append(np.random.uniform(400, 800))
            fuel_cost.append(np.random.uniform(1000, 3000))
        elif fuel == 'Natural Gas':
            energy_output.append(np.random.uniform(100, 800))
            so2_emissions.append(np.random.uniform(10, 100))
            fuel_cost.append(np.random.uniform(4000, 9000))

    df = pd.DataFrame({
        'date': np.random.choice(dates, n_samples),
        'fuel_type': fuel_choice,
        'energy_output': energy_output,
        'so2_emissions': so2_emissions,
        'fuel_cost': fuel_cost,
        'region': np.random.choice(regions, n_samples)
    })

    df.to_csv(DATA_PATH, index=False)
    print(f"Data generated and saved as '{DATA_PATH}'.")

def preprocess_data():
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])

    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['fuel_cost_lag1'] = df.groupby('fuel_type')['fuel_cost'].shift(1)
    df['so2_rolling_avg'] = df.groupby('region')['so2_emissions'].transform(lambda x: x.rolling(12).mean())

    df.fillna(method="bfill", inplace=True)  # Fill missing values
    return df

# -------------------------------
# 2. Hybrid Model (Prophet + XGBoost)
# -------------------------------

class HybridModel:
    def __init__(self):
        self.prophet = Prophet(seasonality_mode='multiplicative')
        self.xgb = XGBRegressor(n_estimators=300, learning_rate=0.01)
        self.preprocessor = None

    def fit(self, df):
        prophet_df = df[['date', 'so2_emissions']].rename(columns={'date': 'ds', 'so2_emissions': 'y'})
        self.prophet.fit(prophet_df)
        prophet_forecast = self.prophet.predict(prophet_df)

        X = df.drop(['so2_emissions', 'date'], axis=1)
        y_residuals = df['so2_emissions'] - prophet_forecast['yhat'].values

        self.preprocessor = ColumnTransformer([
            ('num', StandardScaler(), ['year', 'month', 'fuel_cost', 'fuel_cost_lag1', 'so2_rolling_avg']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['fuel_type', 'region'])
        ])
        X_processed = self.preprocessor.fit_transform(X)

        self.xgb.fit(X_processed, y_residuals)
        print("Hybrid model trained successfully.")

    def predict(self, df):
        prophet_df = df[['date']].rename(columns={'date': 'ds'})
        prophet_forecast = self.prophet.predict(prophet_df)

        X = df.drop(['date'], axis=1)
        X_processed = self.preprocessor.transform(X)
        xgb_pred = self.xgb.predict(X_processed)

        return prophet_forecast['yhat'].values + xgb_pred

# -------------------------------
# 3. Training & Saving the Model
# -------------------------------

def train_model():
    if not os.path.exists(DATA_PATH):
        generate_data()

    df = preprocess_data()
    train_size = int(0.8 * len(df))
    train_df = df.iloc[:train_size]

    model = HybridModel()
    model.fit(train_df)

    joblib.dump(model, MODEL_PATH)
    print(f"Trained model saved as '{MODEL_PATH}'.")

# -------------------------------
# 4. API Routes for Prediction
# -------------------------------

@app.route('/predict', methods=['POST'])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({"error": "Model not found. Please train it first."}), 400

    model = joblib.load(MODEL_PATH)

    data = request.json
    print("Received data:", data)

    df = pd.DataFrame([data])

    # Convert date parts to datetime
    df['date'] = pd.to_datetime(f"{data['year']}-{data['month']}-28")

    # Add required columns
    df['fuel_cost_lag1'] = df['fuel_cost']
    df['so2_rolling_avg'] = 100

    try:
        prediction = model.predict(df)
        return jsonify({"predicted_so2_emissions": round(prediction[0], 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    train_model()
    return jsonify({"message": "Model trained successfully."})

if __name__ == "__main__":
    app.run(debug=True)

# --------------------------------
# Sample input for prediction:
# --------------------------------
# {
#     "year": 2027,
#     "month": 2,
#     "fuel_type": "so2",
#     "fuel_cost": 1200,
#     "region": "North"
# }