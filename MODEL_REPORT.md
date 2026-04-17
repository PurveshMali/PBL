# SO2 Emission Prediction Model Report

## 1. Project Summary

This project is an emissions intelligence platform for thermal power plants. It combines a React dashboard, a Python model API, and an authentication layer to help users inspect plant-level SO2 emissions, explore emissions by state and sector, and generate a plant-level prediction for the 2024-25 average SO2 reading.

The project now uses the real plant registry CSV in the repository, rather than a synthetic dataset. The prediction model is trained on plant attributes such as state, category, total capacity, commissioning date, SO2 norms, prior-year SO2 reading, and unit number. The dashboard presents the prediction along with validation metrics so users can judge model quality at a glance.

Current validation metrics from the latest real-data training run:

- MAE: 90.36
- RMSE: 124.55
- MAPE: 9.68%
- R²: 0.8805

## 2. What the Project Does

The application supports three main workflows:

1. Dashboard exploration.
   - Overview page for summary charts and state-level emissions.
   - Impact page for environmental and cost-related visualizations.
   - Insights page for AI-generated and analytical commentary.

2. Plant-level prediction.
   - The user enters real plant attributes.
   - The Flask model API returns the predicted 2024-25 average SO2 value.
   - Validation metrics are shown beside the prediction.

3. Authentication and access control.
   - Login, register, and protected route flow in the React app.
   - Express/MongoDB auth service for user management.

## 3. Repository Architecture

### Frontend

The frontend is a React app built with Vite and styled using Tailwind CSS. It includes:

- Dashboard pages for overview, insights, impact, and predictions.
- Reusable cards, charts, and layout primitives.
- Framer Motion for motion and interaction polish.
- Recharts for charting.
- React Router for page routing.

### Backend Services

There are two Python/Node-backed services in the repo:

- Flask model service in `Model/so2_model.py`.
- Flask analytics/data service in `Backend/app.py`.
- Express auth service in `Auth/app.js`.

This split is deliberate: the model work is easier to evolve in Python, while auth and dashboard access control already fit the existing Node/Mongo setup.

### Data Layer

The real model now trains on `data/Indian-Air-Pollutiionupdated.csv`, which contains plant-level fields like:

- State
- Name of Project
- Unit No
- Total Capacity
- Date of Commissioning
- Category
- SO2 Norms (mg/Nm3)
- Average SO2 (mg/Nm3) - 2023-24
- Average SO2 (mg/Nm3) - 2024-25

## 4. Why This Tech Stack Was Used

### React

React is a good fit because the UI is highly component-driven. The project has many reusable dashboard pieces: stat cards, chart panels, prediction cards, sidebar navigation, and auth screens. React makes those pieces easy to compose and update.

### Vite

Vite provides fast local development, quick hot reloads, and a simple build path. For a dashboard-heavy project with many interactive components, a fast dev server significantly improves iteration speed.

### Tailwind CSS

Tailwind is useful here because the dashboard needs consistent spacing, typography, gradients, responsive layout, and a premium visual system. It also makes it easy to standardize the same glass-panel style across cards and pages.

### Framer Motion

This project uses Framer Motion for motion polish: card reveals, hover lift, page transitions, and dashboard feel. That keeps the interface from feeling static or template-like.

### Recharts

The app needs clear operational charts, not generic visualizations. Recharts is straightforward for line, bar, area, and pie charts, which is enough for overview, impact, and emission analysis panels.

### Flask

Flask is lightweight and ideal for a small model serving layer. It keeps the prediction endpoint simple, easy to debug, and easy to integrate with the React frontend.

### scikit-learn

scikit-learn was selected for the model because the available dataset is small and tabular. It provides:

- Robust preprocessing with `ColumnTransformer`.
- Easy categorical encoding with `OneHotEncoder`.
- A strong baseline with tree-based regression.
- Simple serialization with `joblib`.

### ExtraTreesRegressor

The current model uses `ExtraTreesRegressor` because it performed best on the real plant dataset in validation compared with the other tested candidates. It handles nonlinear relationships well, works nicely on small tabular datasets, and is less brittle than a purely linear approach.

### Express + MongoDB

The auth service is already built on Node/Express/MongoDB, which is fine for user accounts, JWT-based access control, and dashboard authentication. It keeps the app’s user management separate from the Python model service.

## 5. Data and Feature Engineering

### Raw Data Cleaning

The real plant dataset contains mixed numeric formatting and missing tokens like `NA` or `*`. The model pipeline cleans those fields before training:

- Converts numeric-looking text to numbers.
- Parses commissioning dates.
- Removes rows missing required training values.
- Caps extreme outliers using a 1st/99th percentile clip.

### Engineered Features

The model does not train directly on raw CSV columns only. It also derives useful engineering features:

- `plant_age_years` from commissioning date.
- `commission_year` and `commission_month`.
- `capacity_per_unit`.
- `capacity_to_norm_ratio`.
- `norm_gap` between prior-year SO2 and SO2 norms.

These derived features help the model capture age, scale, compliance pressure, and year-on-year patterning.

### Target Variable

The prediction target is:

- `Average SO2 (mg/Nm3) - 2024-25`

This makes the model directly useful for plant-level forecasting on the latest available reporting period.

## 6. Model Design

### Current Model Pipeline

The final model pipeline is:

1. Input validation and feature engineering.
2. Column-wise preprocessing:
   - Numeric fields scaled with `StandardScaler`.
   - Categorical fields encoded with `OneHotEncoder`.
3. Regression with `ExtraTreesRegressor`.

### Why This Model Works Better Than the Synthetic Version

The earlier synthetic model was built on generated data and mixed assumptions that did not match the actual repository data. The real-data model is stronger because:

- It is trained on actual plant attributes.
- It reflects the structure of the data users see in the dashboard.
- It uses prior-year emissions and plant compliance context.
- It has a much clearer interpretation path for interviews and demos.

### Validation Approach

The latest model uses a shuffled 80/20 train-validation split because the dataset is not a time series. That gives a more realistic estimate of how the model behaves on unseen plants than a simple ordered split.

## 7. Prediction API

### `/predict`

The model service accepts raw plant-level input and returns:

- `predicted_so2_emissions`
- `model_metrics`
- `feature_importances`

Example input shape:

```json
{
  "state": "Gujarat",
  "category": "C",
  "total_capacity": 800,
  "commissioning_date": "2012-02-25",
  "so2_norms": 200,
  "prior_avg_so2": 998,
  "unit_no": 1
}
```

### `/train`

The training endpoint retrains the model from the real CSV and saves a versioned bundle with metrics and feature importance information.

## 8. Frontend Product Design Notes

The prediction page was refactored into a more industry-style layout:

- A premium hero section with a concise value proposition.
- A sticky form panel with plant-level fields.
- A results card that shows prediction plus quality metrics.
- A small donut-style fit badge for at-a-glance model confidence.

The other dashboards were also upgraded to the same glass-panel visual language so the app feels like one coherent product rather than separate gray cards.

## 9. Edge Cases and Failure Modes

These are the cases the project should handle or be ready to discuss:

### Data input edge cases

- Missing commissioning date.
- Non-numeric total capacity, SO2 norms, or prior-year SO2 values.
- Zero or negative unit numbers.
- Unknown state or category values.
- Empty form submissions.

### Dataset edge cases

- Rows with `NA` or `*` in numeric fields.
- Plants with missing prior-year SO2 readings.
- Very old plants with unusually high emissions.
- Outliers due to data entry errors.
- Duplicate plant entries or multiple units per project.

### Model edge cases

- Unseen categorical values during prediction.
- Outlier plants outside the training distribution.
- Predictions with sparse or incomplete plant metadata.
- Over-reliance on prior-year SO2 as a proxy for the target.

### System edge cases

- Model artifact missing or outdated.
- Frontend calling the API before the model is trained.
- CORS issues between the React app and Flask service.
- Auth token missing or expired.
- Chart APIs unavailable when dashboard pages mount.

## 10. Design and Engineering Tradeoffs

### Why not use a heavy deep learning model?

The dataset is small and tabular. A deep model would likely be harder to tune, less interpretable, and overkill for the problem size. Tree-based tabular modeling is a better engineering tradeoff.

### Why include prior-year SO2?

Because it is one of the strongest predictive signals available in the dataset. This is a practical choice for plant-level forecasting and also a good interview discussion point about avoiding leakage versus using a legitimate leading indicator.

### Why not use one big monolithic stack?

The current split is pragmatic:

- Python for data and model work.
- Node for auth and user management.
- React for the dashboard.

That separation keeps responsibilities clear and lets each layer use the tools it is best at.

## 11. What Would Be Good Next Improvements

- Add project name as an optional search field and use it for lookup-assisted input filling.
- Replace static dashboard charts with live APIs for every panel.
- Add model versioning and a simple drift report.
- Add SHAP or permutation importance explanations for individual predictions.
- Add a proper model registry or experiment tracking.
- Add unit tests for payload validation and feature engineering.

## 12. Interview Questions You Should Expect

### Architecture and stack

1. Why did you split the project into React, Flask, and Express services?
2. Why use Flask for the model and Express for auth?
3. Why did you choose Vite and Tailwind for the frontend?
4. Why is the prediction service separate from the dashboard UI?
5. How does the frontend communicate with the model API?

### Data and model

6. What dataset did you use and what are the target and features?
7. Why did you move away from the synthetic dataset?
8. How did you clean missing values like `NA` and `*`?
9. Why did you engineer `plant_age_years` and `norm_gap`?
10. Why did you choose ExtraTreesRegressor?
11. How did you evaluate the model?
12. Why is R² high but MAE still meaningful to inspect?
13. Is prior-year SO2 a leakage risk?
14. What makes this model more trustworthy than the synthetic version?

### Frontend and UX

15. How did you make the prediction page feel like an enterprise dashboard?
16. Why show metrics on the prediction card?
17. Why use motion and glass-panel styling?
18. How are charts reused across pages?
19. What would you do to make the UI more accessible?

### Backend and API

20. What does the `/train` endpoint do?
21. What happens if the model artifact is missing or outdated?
22. How do you validate request payloads?
23. How do you handle unseen categories at prediction time?
24. How would you deploy the Flask model service?

### Practical / deeper questions

25. What are the main sources of error in this project?
26. What would you improve if you had more data?
27. How would you explain the prediction to a plant operator?
28. How would you monitor model drift in production?
29. How would you add explainability to individual predictions?
30. How would you scale this from a demo to a real internal tool?

## 13. Short Interview Answers You Can Use

- The model is tabular and small-data, so a tree ensemble is a better fit than a deep model.
- The frontend is designed around reuse, clarity, and visual hierarchy, not just a demo layout.
- The real dataset improves realism and gives the model meaningful plant-level structure.
- The prediction card shows metrics because a good demo should expose confidence, not just a number.
- The biggest technical risk is data quality, not rendering or routing.

## 14. Important Talking Points

If you are presenting this project, emphasize these points:

- You moved from synthetic data to real repository data.
- You engineered plant-level features rather than using raw columns only.
- You validated the model with a proper holdout split.
- You surfaced quality metrics in the UI for transparency.
- You built a multi-service app with clear separation of concerns.
- You upgraded the interface to feel like a production dashboard rather than a classroom prototype.

## 15. Final Takeaway

This project is strongest when you present it as a full-stack emissions intelligence system:

- A real-data model service that predicts plant SO2 emissions.
- A polished dashboard for operational exploration.
- An auth layer for controlled access.
- A clean, interview-ready story about data cleaning, feature engineering, validation, and product thinking.

That combination is more compelling than a simple model demo because it shows both technical depth and product judgment.
