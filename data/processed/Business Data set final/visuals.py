import pandas as pd
import numpy as np
import json

# Load dataset
df = pd.read_csv("business_dataset_cleaned_1500_rows1.csv")

# Clean column names
df.columns = df.columns.str.strip().str.lower()

print("Available Columns:", df.columns)

# ----------------------------
# Detect Date Column
# ----------------------------
date_col = None
for col in df.columns:
    if "date" in col:
        date_col = col
        break

if date_col is None:
    raise ValueError("No date column found.")

df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
df = df.dropna(subset=[date_col])

# ----------------------------
# Detect Main Numeric Column
# ----------------------------
numeric_cols = df.select_dtypes(include=np.number).columns.tolist()

if not numeric_cols:
    raise ValueError("No numeric columns found for analysis.")

main_metric = numeric_cols[0]  # pick first numeric column
print("Using numeric column for analysis:", main_metric)

# ----------------------------
# Monthly Trend
# ----------------------------
monthly_data = df.groupby(df[date_col].dt.to_period("M"))[main_metric].sum()
monthly_data = monthly_data.sort_index()
monthly_data.index = monthly_data.index.astype(str)

# ----------------------------
# Growth Rate
# ----------------------------
growth_rates = monthly_data.pct_change().dropna()
avg_growth = float(growth_rates.mean())

# ----------------------------
# Prediction using numpy
# ----------------------------
monthly_df = monthly_data.reset_index()
monthly_df.columns = ["month", "value"]
monthly_df["month_index"] = np.arange(len(monthly_df))

x = monthly_df["month_index"].values
y = monthly_df["value"].values

slope, intercept = np.polyfit(x, y, 1)

future_index = np.arange(len(x), len(x) + 3)
future_predictions = slope * future_index + intercept

# ----------------------------
# Region Comparison (if exists)
# ----------------------------
region_col = None
for col in df.columns:
    if "region" in col:
        region_col = col
        break

region_analysis = {}

if region_col:
    region_data = df.groupby(region_col)[main_metric].sum()
    region_analysis = {
        "region_wise_totals": region_data.to_dict(),
        "top_region": region_data.idxmax(),
        "lowest_region": region_data.idxmin()
    }

# ----------------------------
# Summary Stats
# ----------------------------
summary_stats = {
    "mean": float(df[main_metric].mean()),
    "median": float(df[main_metric].median()),
    "std_dev": float(df[main_metric].std()),
    "max": float(df[main_metric].max()),
    "min": float(df[main_metric].min())
}

# ----------------------------
# Final JSON Output
# ----------------------------
result = {
    "column_used_for_analysis": main_metric,
    "trend_analysis": {
        "monthly_totals": monthly_data.to_dict(),
        "average_growth_rate": avg_growth
    },
    "prediction_next_3_months": {
        f"future_month_{i+1}": float(pred)
        for i, pred in enumerate(future_predictions)
    },
    "region_comparison": region_analysis,
    "summary_statistics": summary_stats
}

# ---------------------------------
# Save JSON to File
# ---------------------------------

output_file = "business_analysis_output.json"

with open(output_file, "w") as f:
    json.dump(result, f, indent=4)

print(f"\n✅ JSON file successfully created: {output_file}")


