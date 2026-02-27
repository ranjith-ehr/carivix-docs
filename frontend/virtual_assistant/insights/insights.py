import json
import numpy as np
import os

ARTIFACT_PATH = "Project Phase 2/artifacts"


def safe_change(start, end):
    return 0 if start == 0 else ((end - start) / start) * 100


def insights():

    # Ensure artifacts folder exists
    os.makedirs(ARTIFACT_PATH, exist_ok=True)

    # Load saved artifacts
    with open(f"{ARTIFACT_PATH}/forecast.json") as f:
        forecast = json.load(f)

    with open(f"{ARTIFACT_PATH}/metrics.json") as f:
        metrics = json.load(f)

    # Extract arrays
    revenues = np.array([m["revenue"] for m in forecast.values()])
    profits = np.array([m["profit"] for m in forecast.values()])
    sales = np.array([m["sales_units"] for m in forecast.values()])
    customers = np.array([m["new_customers"] for m in forecast.values()])
    costs = np.array([m["cost"] for m in forecast.values()])
    expenses = np.array([m["expenses"] for m in forecast.values()])

    # Trends
    revenue_change = safe_change(revenues[0], revenues[-1])
    sales_change = safe_change(sales[0], sales[-1])
    customer_change = safe_change(customers[0], customers[-1])

    # Ratios
    avg_profit_margin = np.mean(profits / revenues) * 100
    avg_cost_ratio = np.mean(costs / revenues) * 100
    avg_expense_ratio = np.mean(expenses / revenues) * 100

    growth_direction = "increasing" if revenue_change > 0 else "decreasing"

    # Model confidence
    revenue_model = next(m for m in metrics if m["Target"] == "revenue")

    insights_data = {
        "revenue_trend":
            f"Revenue forecasted to be {growth_direction} by {round(revenue_change,2)}%.",

        "profitability":
            f"Average monthly profit {round(np.mean(profits),2)} "
            f"(margin {round(avg_profit_margin,2)}%).",

        "sales_volume":
            f"Sales may change by {round(sales_change,2)}%.",

        "customer_growth":
            f"Customer count may change by {round(customer_change,2)}%.",

        "cost_efficiency":
            f"Costs average {round(avg_cost_ratio,2)}% of revenue.",

        "expense_efficiency":
            f"Expenses average {round(avg_expense_ratio,2)}% of revenue.",

        "revenue_per_unit":
            f"Average revenue per unit {round(np.mean(revenues)/np.mean(sales),2)}.",

        "risk_indicator":
            f"Profit variability {round(np.std(profits),2)}.",

        "model_confidence":
            f"Revenue model R2={revenue_model['R2']} "
            f"MAPE={revenue_model['MAPE (%)']}%."
    }

    # Save insights
    with open(f"{ARTIFACT_PATH}/insights.json", "w", encoding="utf-8") as f:
        json.dump(insights_data, f, indent=4)

    print("Insights saved to Insights.json")


if __name__ == "__main__":
    insights()
