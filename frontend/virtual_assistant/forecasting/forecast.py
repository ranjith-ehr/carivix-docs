import json
import numpy as np
import pandas as pd
import joblib
import os

# Get the project root directory (parent of forecasting folder)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACT_PATH = os.path.join(PROJECT_ROOT, "artifacts")
MODEL_FILE = os.path.join(ARTIFACT_PATH, "business_forecast_model.pkl")

# Also update data path
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "business_dataset_cleaned_1500_rows1.csv")

def forecast():

    # Load the pre-trained model
    model_bundle = joblib.load(MODEL_FILE)
    models = model_bundle["models"]
    feature_cols = model_bundle["feature_cols"]

    # Load the original data to get historical data
    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    # Add time features - explicitly convert to appropriate types
    df["month_num"] = df["date"].dt.month.astype(int)
    df["year"] = df["date"].dt.year.astype(int)
    df["quarter"] = df["date"].dt.quarter.astype(int)
    df["month_sin"] = np.sin(2 * np.pi * df["month_num"].astype(float) / 12).astype(float)
    df["month_cos"] = np.cos(2 * np.pi * df["month_num"].astype(float) / 12).astype(float)
    df["year_trend"] = (df["year"] - df["year"].min()).astype(int)

    targets = ["sales_units", "revenue", "new_customers", "cost", "expenses"]

    # Add lag features to original data - explicitly convert to float to avoid ArrayLike type issues
    for col in targets:
        df[f"{col}_lag1"] = df[col].shift(1).astype(float)
        df[f"{col}_lag2"] = df[col].shift(2).astype(float)
        df[f"{col}_lag3"] = df[col].shift(3).astype(float)
        df[f"{col}_roll3"] = df[col].rolling(3).mean().astype(float)
        df[f"{col}_growth1"] = df[col].pct_change(1).astype(float)

    # Drop rows with NaN values (first 3 rows)
    df = df.dropna().reset_index(drop=True)

    forecast_results = {}
    history = df.copy()

    for step in range(1, 5):

        last_row = history.iloc[-1:].copy()

        next_month = int(last_row["month_num"].values[0] + 1)
        next_year = int(last_row["year"].iloc[0])

        if next_month > 12:
            next_month = 1
            next_year += 1

        new_row = last_row.copy()
        new_row.loc[new_row.index[0], "month_num"] = next_month
        new_row.loc[new_row.index[0], "year"] = next_year
        new_row.loc[new_row.index[0], "quarter"] = ((next_month-1)//3)+1
        new_row.loc[new_row.index[0], "month_sin"] = float(np.sin(2*np.pi*next_month/12))
        new_row.loc[new_row.index[0], "month_cos"] = float(np.cos(2*np.pi*next_month/12))
        new_row.loc[new_row.index[0], "year_trend"] = int(next_year - df["year"].min())

        step_result = {}

        for target in targets:
            pred = float(models[target].predict(new_row[feature_cols])[0])
            step_result[target] = pred
            new_row.loc[new_row.index[0], target] = pred

        step_result["profit"] = float(
            step_result["revenue"]
            - step_result["cost"]
            - step_result["expenses"]
        )

        forecast_results[f"Month+{step}"] = {
            k: round(v, 2) for k, v in step_result.items()
        }

        # Update lag features for the new row - explicitly convert to float
        for col in targets:
            # Get the lag values from history - explicitly convert to float
            new_row.loc[new_row.index[0], f"{col}_lag1"] = float(history[col].iloc[-1])
            new_row.loc[new_row.index[0], f"{col}_lag2"] = float(history[col].iloc[-2] if len(history) > 1 else history[col].iloc[-1])
            new_row.loc[new_row.index[0], f"{col}_lag3"] = float(history[col].iloc[-3] if len(history) > 2 else history[col].iloc[-1])
            
            # Rolling mean of last 3 values (including new prediction)
            recent_vals = [float(v) for v in list(history[col].iloc[-2:])] + [pred]
            new_row.loc[new_row.index[0], f"{col}_roll3"] = float(np.mean(recent_vals))
            
            # Growth - explicitly handle zero division
            if float(history[col].iloc[-1]) != 0:
                new_row.loc[new_row.index[0], f"{col}_growth1"] = float((pred - float(history[col].iloc[-1])) / float(history[col].iloc[-1]))
            else:
                new_row.loc[new_row.index[0], f"{col}_growth1"] = float(0)

        history = pd.concat([history, new_row], ignore_index=True)

    with open(f"{ARTIFACT_PATH}/forecast.json", "w") as f:
        json.dump(forecast_results, f, indent=4)

    print("Forecast saved.")


if __name__ == "__main__":
    forecast()
