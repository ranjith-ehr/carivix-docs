# Data Science Pipeline – Mini Carivix

## 1. Purpose

This document describes the end-to-end machine learning workflow responsible for forecasting business metrics and preparing predictive artifacts for production deployment.

The pipeline transforms structured analytical datasets into trained forecasting models and structured prediction outputs.

---

## 2. Primary Objectives

The data science stage is responsible for:

- Time-series forecasting of key business metrics
- Preventing data leakage during model training
- Producing evaluation metrics
- Exporting serialized model artifacts
- Generating structured forecast outputs

---

## 3. Dataset Inputs

The pipeline consumes cleaned datasets provided by the Data Analysis stage.

No structural mutation occurs at this stage.

---

## 4. Feature Engineering Strategy

To preserve statistical integrity and temporal accuracy, the pipeline applies:

- Time-based feature extraction (year, month, seasonal encoding)
- Lag features for historical dependency
- Rolling averages
- Growth rate calculations
- Target isolation to prevent leakage

![Feature Engineering Flow Diagram](https://i.postimg.cc/XvjqxkBF/Feature-Engineering-Flow-Diagram.png)

---

## 5. Data Splitting Strategy

The dataset is split chronologically to preserve temporal order:

- Training Set (historical portion)
- Validation Set (recent historical data)
- Test Set (latest unseen data)

Random shuffling is explicitly avoided.

---

## 6. Model Selection Process

Multiple algorithms were evaluated based on:

- Predictive stability
- Computational efficiency
- Structured data compatibility
- Non-linear pattern capture capability

Final model selection was based on performance metrics and forecasting reliability.

---

## 7. Evaluation Metrics

Model performance is measured using:

- R² (variance explanation)
- MAE (mean absolute error)
- RMSE (root mean squared error)
- MAPE (mean absolute percentage error)

Metrics are recorded and exported as structured artifacts.

---

## 8. Output Artifacts

The pipeline generates:

- Serialized model file
- Forecast output JSON
- Evaluation metrics JSON
- Insight summaries
- Execution documentation

These artifacts are handed off to the ML/AI Engineering stage.

---

## 9. Related Documentation

- ML Model Details → `ML_MODEL_DETAILS.md`
- ML AI Serving → `ML_AI_SERVING.md`
- Data Engineering → `DATA_ENGINEERING.md`