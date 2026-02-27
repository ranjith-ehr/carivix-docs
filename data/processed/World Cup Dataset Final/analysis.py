import pandas as pd
import json

# Load dataset
df = pd.read_csv("cleaned_world_cup_data.csv")

# Example calculations
matches_trend = df.groupby("year").size()

avg_innings1_runs = df["first_innings_score"].mean()
avg_innings2_runs = df["second_innings_score"].mean()

team_wise_wins = df["winner"].value_counts()

best_team = team_wise_wins.idxmax()
worst_team = team_wise_wins.idxmin()

# Create dictionary
analysis_result = {
    "matches_trend": matches_trend.to_dict(),
    "average_runs": {
        "innings1": float(avg_innings1_runs),
        "innings2": float(avg_innings2_runs)
    },
    "team_wise_wins": team_wise_wins.to_dict(),
    "best_team": best_team,
    "worst_team": worst_team
}

# Save JSON file
with open("analysis.json", "w") as f:
    json.dump(analysis_result, f, indent=4)

print("JSON file created successfully!")
