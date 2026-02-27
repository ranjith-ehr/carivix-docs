import pandas as pd
import numpy as np
import json
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ARTIFACT_PATH = "artifacts"


def train_model():

    # =========================
    # 1. LOAD DATA
    # =========================
    df = pd.read_csv("data/business_dataset_cleaned_1500_rows1.csv")
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    # =========================
    # 2. TIME FEATURES
    # =========================
    df["month_num"] = df["date"].dt.month
    df["year"] = df["date"].dt.year
    df["quarter"] = df["date"].dt.quarter
    df["month_sin"] = np.sin(2 * np.pi * df["month_num"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month_num"] / 12)
    df["year_trend"] = df["year"] - df["year"].min()

    targets = ["sales_units", "revenue", "new_customers", "cost", "expenses"]

    # =========================
    # 3. FEATURE ENGINEERING
    # =========================
    for col in targets:
        df[f"{col}_lag1"] = df[col].shift(1)
        df[f"{col}_lag2"] = df[col].shift(2)
        df[f"{col}_lag3"] = df[col].shift(3)
        df[f"{col}_roll3"] = df[col].rolling(3).mean()
        df[f"{col}_growth1"] = df[col].pct_change(1)

    df = df.dropna().reset_index(drop=True)

    # =========================
    # 4. TRAIN / TEST SPLIT
    # =========================
    train_size = int(len(df) * 0.8)
    train = df.iloc[:train_size]
    test = df.iloc[train_size:]

    feature_cols = train.select_dtypes(include=[np.number]).columns.tolist()

    # Remove target columns from features
    for t in targets:
        if t in feature_cols:
            feature_cols.remove(t)

    X_train = train[feature_cols]
    X_test = test[feature_cols]

    models = {}
    metrics = []

    # =========================
    # 5. TRAIN MODELS
    # =========================
    for target in targets:

        model = HistGradientBoostingRegressor(
            max_depth=4,
            learning_rate=0.05,
            max_iter=500,
            min_samples_leaf=10,
            l2_regularization=1.0,
            random_state=42
        )

        y_train = train[target]
        y_test = test[target]

        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        # Evaluation metrics
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        mape = np.mean(np.abs((y_test - preds) / y_test)) * 100

        #  Needed for final accuracy calculation
        mean_true = np.mean(y_test)

        metrics.append({
            "Target": target,
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4),
            "MAPE (%)": round(mape, 2),
            "Mean_y_true": round(float(mean_true), 2)
        })

        models[target] = model

    # =========================
    # 6. SAVE METRICS
    # =========================
    with open(f"{ARTIFACT_PATH}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=4)

    print("Training complete. Metrics saved.")

    return models, df, feature_cols


# =========================
# RUN DIRECTLY
# =========================
if __name__ == "__main__":
    train_model()
