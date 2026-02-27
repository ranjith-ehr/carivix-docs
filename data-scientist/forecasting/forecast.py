import json
import numpy as np
import pandas as pd
from models.train_model import train_model

ARTIFACT_PATH = "artifacts"

def forecast():

    models, df, feature_cols = train_model()

    targets = ["sales_units","revenue","new_customers","cost","expenses"]
    forecast_results = {}
    history = df.copy()

    for step in range(1,5):

        last_row = history.iloc[-1:].copy()

        next_month = last_row["month_num"].iloc[0] + 1
        next_year = last_row["year"].iloc[0]

        if next_month > 12:
            next_month = 1
            next_year += 1

        new_row = last_row.copy()
        new_row["month_num"] = next_month
        new_row["year"] = next_year
        new_row["quarter"] = ((next_month-1)//3)+1
        new_row["month_sin"] = np.sin(2*np.pi*next_month/12)
        new_row["month_cos"] = np.cos(2*np.pi*next_month/12)
        new_row["year_trend"] = next_year - df["year"].min()

        step_result = {}

        for target in targets:
            pred = models[target].predict(new_row[feature_cols])[0]
            step_result[target] = float(pred)
            new_row[target] = pred

        step_result["profit"] = (
            step_result["revenue"]
            - step_result["cost"]
            - step_result["expenses"]
        )

        forecast_results[f"Month+{step}"] = {
            k: round(v,2) for k,v in step_result.items()
        }

        history = pd.concat([history,new_row],ignore_index=True)

        for col in targets:
            history[f"{col}_lag1"] = history[col].shift(1)
            history[f"{col}_lag2"] = history[col].shift(2)
            history[f"{col}_lag3"] = history[col].shift(3)
            history[f"{col}_roll3"] = history[col].rolling(3).mean()
            history[f"{col}_growth1"] = history[col].pct_change(1)

    with open(f"{ARTIFACT_PATH}/forecast.json","w") as f:
        json.dump(forecast_results,f,indent=4)

    print("Forecast saved.")


if __name__ == "__main__":
    forecast()
