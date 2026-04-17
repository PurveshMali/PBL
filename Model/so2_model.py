from __future__ import annotations

import os
import sys
import types
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

app = Flask(__name__)
CORS(app)

model_package = sys.modules.get("Model")
if model_package is None:
    model_package = types.ModuleType("Model")
    model_package.__path__ = [str(Path(__file__).resolve().parent)]
    sys.modules["Model"] = model_package
sys.modules.setdefault("Model.so2_model", sys.modules[__name__])

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATA_PATH = PROJECT_ROOT / "data" / "Indian-Air-Pollutiionupdated.csv"
MODEL_PATH = PROJECT_ROOT / "so2_trained_model.pkl"
MODEL_VERSION = 4

TARGET_COLUMN = "Average SO2 (mg/Nm3) - 2024-25"
PRIOR_TARGET_COLUMN = "Average SO2 (mg/Nm3) - 2023-24"

RAW_INPUT_COLUMNS = [
    "state",
    "category",
    "total_capacity",
    "commissioning_date",
    "so2_norms",
    "prior_avg_so2",
    "unit_no",
]

FEATURE_COLUMNS = [
    "state",
    "category",
    "total_capacity",
    "so2_norms",
    "prior_avg_so2",
    "plant_age_years",
    "unit_no",
    "capacity_per_unit",
    "capacity_to_norm_ratio",
    "norm_gap",
    "commission_year",
    "commission_month",
]

NUMERIC_FEATURES = [
    "total_capacity",
    "so2_norms",
    "prior_avg_so2",
    "plant_age_years",
    "unit_no",
    "capacity_per_unit",
    "capacity_to_norm_ratio",
    "norm_gap",
    "commission_year",
    "commission_month",
]
CATEGORICAL_FEATURES = ["state", "category"]


def _numeric_series(series: pd.Series) -> pd.Series:
    return pd.to_numeric(
        series.astype(str).str.replace(",", "", regex=False).replace({"NA": np.nan, "*": np.nan}),
        errors="coerce",
    )


def load_real_dataset() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Missing dataset: {DATA_PATH}")

    data = pd.read_csv(DATA_PATH)
    data.columns = data.columns.str.strip()

    data["State"] = data["State"].astype(str).str.strip()
    data["Category"] = data["Category"].astype(str).str.strip().str.upper()
    data["Name of Project"] = data["Name of Project"].astype(str).str.strip()
    data["Date of Commissioning"] = pd.to_datetime(
        data["Date of Commissioning"], dayfirst=True, errors="coerce"
    )

    for column in [
        "Unit No",
        "Total Capacity",
        "SO2 Norms (mg/Nm3)",
        PRIOR_TARGET_COLUMN,
        TARGET_COLUMN,
    ]:
        data[column] = _numeric_series(data[column])

    data = data.dropna(
        subset=["State", "Category", "Date of Commissioning", "Total Capacity", "SO2 Norms (mg/Nm3)", TARGET_COLUMN]
    ).copy()

    data["prior_avg_so2"] = data[PRIOR_TARGET_COLUMN].fillna(data[PRIOR_TARGET_COLUMN].median())
    data["unit_no"] = data["Unit No"].fillna(data["Unit No"].median())

    data["state"] = data["State"].str.title()
    data["category"] = data["Category"].str.upper()
    data["commission_year"] = data["Date of Commissioning"].dt.year
    data["commission_month"] = data["Date of Commissioning"].dt.month
    data["plant_age_years"] = (
        pd.Timestamp("2025-01-01") - data["Date of Commissioning"]
    ).dt.days / 365.25
    data["capacity_per_unit"] = data["Total Capacity"] / np.maximum(data["unit_no"], 1.0)
    data["capacity_to_norm_ratio"] = data["Total Capacity"] / np.maximum(data["SO2 Norms (mg/Nm3)"], 1.0)
    data["norm_gap"] = data["prior_avg_so2"] - data["SO2 Norms (mg/Nm3)"]

    for column in ["Total Capacity", "SO2 Norms (mg/Nm3)", "prior_avg_so2", TARGET_COLUMN]:
        lower = data[column].quantile(0.01)
        upper = data[column].quantile(0.99)
        data[column] = data[column].clip(lower=lower, upper=upper)

    data = data.sort_values(["State", "Name of Project", "Unit No"]).reset_index(drop=True)
    return data


def build_feature_frame(data: dict | pd.DataFrame) -> pd.DataFrame:
    if isinstance(data, dict):
        frame = pd.DataFrame([data])
    else:
        frame = data.copy()

    if isinstance(frame, pd.DataFrame) and frame.columns.duplicated().any():
        frame = frame.loc[:, ~frame.columns.duplicated()].copy()

    if "source_avg_so2" in frame.columns and "prior_avg_so2" not in frame.columns:
        frame = frame.rename(columns={"source_avg_so2": "prior_avg_so2"})

    missing_columns = [column for column in RAW_INPUT_COLUMNS if column not in frame.columns]
    if missing_columns:
        raise ValueError(f"Missing required fields: {', '.join(missing_columns)}")

    frame["state"] = frame["state"].astype(str).str.strip().str.title()
    frame["category"] = frame["category"].astype(str).str.strip().str.upper()
    frame["total_capacity"] = pd.to_numeric(frame["total_capacity"], errors="coerce")
    frame["so2_norms"] = pd.to_numeric(frame["so2_norms"], errors="coerce")
    frame["prior_avg_so2"] = pd.to_numeric(frame["prior_avg_so2"], errors="coerce")
    frame["unit_no"] = pd.to_numeric(frame["unit_no"], errors="coerce")
    frame["commissioning_date"] = pd.to_datetime(frame["commissioning_date"], errors="coerce")

    if frame[["total_capacity", "so2_norms", "prior_avg_so2", "unit_no", "commissioning_date"]].isna().any().any():
        raise ValueError("Plant inputs must be valid values.")

    frame["commission_year"] = frame["commissioning_date"].dt.year
    frame["commission_month"] = frame["commissioning_date"].dt.month
    frame["plant_age_years"] = (
        pd.Timestamp("2025-01-01") - frame["commissioning_date"]
    ).dt.days / 365.25
    frame["commission_year"] = frame["commissioning_date"].dt.year
    frame["commission_month"] = frame["commissioning_date"].dt.month
    frame["capacity_per_unit"] = frame["total_capacity"] / np.maximum(frame["unit_no"], 1.0)
    frame["capacity_to_norm_ratio"] = frame["total_capacity"] / np.maximum(frame["so2_norms"], 1.0)
    frame["norm_gap"] = frame["prior_avg_so2"] - frame["so2_norms"]

    if (frame["total_capacity"] <= 0).any():
        raise ValueError("Total capacity must be greater than zero.")
    if (frame["so2_norms"] <= 0).any():
        raise ValueError("SO2 norms must be greater than zero.")
    if (frame["unit_no"] <= 0).any():
        raise ValueError("Unit number must be greater than zero.")

    return frame[FEATURE_COLUMNS]


class PlantSO2Model:
    def __init__(self):
        self.pipeline = Pipeline(
            steps=[
                (
                    "preprocessor",
                    ColumnTransformer(
                        transformers=[
                            ("num", StandardScaler(), NUMERIC_FEATURES),
                            (
                                "cat",
                                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                                CATEGORICAL_FEATURES,
                            ),
                        ]
                    ),
                ),
                (
                    "regressor",
                    ExtraTreesRegressor(
                        n_estimators=800,
                        random_state=42,
                        min_samples_leaf=1,
                        n_jobs=-1,
                    ),
                ),
            ]
        )
        self.training_metrics = {}
        self.feature_importances = []

    def fit(self, df: pd.DataFrame) -> None:
        raw_frame = pd.DataFrame(
            {
                "state": df["State"].astype(str).str.strip().str.title(),
                "category": df["Category"].astype(str).str.strip().str.upper(),
                "total_capacity": df["Total Capacity"],
                "commissioning_date": df["Date of Commissioning"],
                "so2_norms": df["SO2 Norms (mg/Nm3)"],
                "prior_avg_so2": df["prior_avg_so2"],
                "unit_no": df["unit_no"],
            }
        )
        feature_frame = build_feature_frame(raw_frame)
        self.pipeline.fit(feature_frame, df[TARGET_COLUMN].to_numpy())

        feature_names = self.pipeline.named_steps["preprocessor"].get_feature_names_out()
        importances = self.pipeline.named_steps["regressor"].feature_importances_
        ranked = sorted(
            zip(feature_names, importances),
            key=lambda item: item[1],
            reverse=True,
        )
        self.feature_importances = [
            {"feature": name, "importance": round(float(score), 4)}
            for name, score in ranked[:10]
        ]

    def predict(self, data: dict | pd.DataFrame):
        feature_frame = build_feature_frame(data)
        predictions = self.pipeline.predict(feature_frame)
        return np.maximum(np.asarray(predictions), 0.0)


def evaluate_model(model: PlantSO2Model, validation_df: pd.DataFrame) -> dict:
    if validation_df.empty:
        return {}

    actuals = validation_df[TARGET_COLUMN].to_numpy()
    predictions = model.predict(
        pd.DataFrame(
            {
                "state": validation_df["State"].astype(str).str.strip().str.title(),
                "category": validation_df["Category"].astype(str).str.strip().str.upper(),
                "total_capacity": validation_df["Total Capacity"],
                "commissioning_date": validation_df["Date of Commissioning"],
                "so2_norms": validation_df["SO2 Norms (mg/Nm3)"],
                "prior_avg_so2": validation_df["prior_avg_so2"],
                "unit_no": validation_df["unit_no"],
            }
        )
    )

    mae = mean_absolute_error(actuals, predictions)
    rmse = np.sqrt(mean_squared_error(actuals, predictions))
    mape = float(np.mean(np.abs((actuals - predictions) / np.maximum(np.abs(actuals), 1e-6))) * 100)
    r2 = r2_score(actuals, predictions)

    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "mape": round(mape, 2),
        "r2": round(float(r2), 4),
    }


def train_model():
    df = load_real_dataset()
    train_df, validation_df = train_test_split(df, test_size=0.2, random_state=42, shuffle=True)

    model = PlantSO2Model()
    model.fit(train_df)
    metrics = evaluate_model(model, validation_df)
    model.training_metrics = metrics

    bundle = {
        "version": MODEL_VERSION,
        "model": model,
        "metrics": metrics,
        "feature_columns": FEATURE_COLUMNS,
        "feature_importances": model.feature_importances,
    }
    joblib.dump(bundle, MODEL_PATH)
    print(f"Trained model saved as '{MODEL_PATH}'.")
    if metrics:
        print(f"Validation metrics: {metrics}")
    return bundle


def load_model_bundle():
    if not MODEL_PATH.exists():
        raise FileNotFoundError("Model not found. Please train it first.")

    bundle = joblib.load(MODEL_PATH)
    if isinstance(bundle, dict) and bundle.get("version") == MODEL_VERSION:
        return bundle

    raise ValueError("Outdated model artifact. Retrain the model with /train.")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        bundle = load_model_bundle()
    except (FileNotFoundError, ValueError) as error:
        return jsonify({"error": str(error)}), 400

    data = request.get_json(silent=True) or {}

    try:
        prediction = bundle["model"].predict(data)
        return jsonify(
            {
                "predicted_so2_emissions": round(float(prediction[0]), 2),
                "model_metrics": bundle.get("metrics", {}),
                "feature_importances": bundle.get("feature_importances", []),
            }
        )
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route("/train", methods=["POST"])
def train():
    bundle = train_model()
    return jsonify(
        {
            "message": "Model trained successfully.",
            "metrics": bundle.get("metrics", {}),
            "feature_importances": bundle.get("feature_importances", []),
        }
    )


if __name__ == "__main__":
    if not os.environ.get("WERKZEUG_RUN_MAIN"):
        pass
    app.run(debug=True, port=8081)