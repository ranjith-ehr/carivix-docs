import json
import numpy as np

ARTIFACT_PATH = "artifacts"


def safe_change(start, end):
    return 0 if start == 0 else ((end - start) / start) * 100


def insights():

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

    # Trend analysis
    revenue_change = safe_change(revenues[0], revenues[-1])
    sales_change = safe_change(sales[0], sales[-1])
    customer_change = safe_change(customers[0], customers[-1])

    # Business ratios
    avg_profit_margin = np.mean(profits / revenues) * 100
    avg_cost_ratio = np.mean(costs / revenues) * 100
    avg_expense_ratio = np.mean(expenses / revenues) * 100

    growth_direction = "increasing" if revenue_change > 0 else "decreasing"

    # Model confidence
    revenue_model = next(m for m in metrics if m["Target"] == "revenue")

    insights_data = {
        "Revenue Trend":
            f"Revenue is forecasted to be {growth_direction} by {round(revenue_change,2)}%.",

        "Profitability":
            f"Average monthly profit ≈ {round(np.mean(profits),2)} "
            f"(margin {round(avg_profit_margin,2)}%).",

        "Sales Volume":
            f"Sales may change by {round(sales_change,2)}%.",

        "Customer Growth":
            f"Customer count may change by {round(customer_change,2)}%.",

        "Cost Efficiency":
            f"Costs average {round(avg_cost_ratio,2)}% of revenue.",

        "Expense Efficiency":
            f"Expenses average {round(avg_expense_ratio,2)}% of revenue.",

        "Revenue per Unit":
            f"Avg revenue per unit ≈ "
            f"{round(np.mean(revenues)/np.mean(sales),2)}.",

        "Risk Indicator":
            f"Profit variability (std) is {round(np.std(profits),2)}.",

        "Model Confidence":
            f"Revenue model → R2={revenue_model['R2']} | "
            f"MAPE={revenue_model['MAPE (%)']}%."
    }

    print("\n FULL INSIGHTS SUMMARY:\n")

    for k, v in insights_data.items():
        print(f"• {k}: {v}")


if __name__ == "__main__":
    insights()
