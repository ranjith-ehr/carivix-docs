from models.train_model import train_model
from forecasting.forecast import forecast
from insights.insights import insights


def run_pipeline():

    print("\n Step 1: Training Model...")
    train_model()

    print("\n Step 2: Generating Forecast...")
    forecast()

    print("\n Step 3: Generating Insights...")
    insights()

    print("\n Pipeline completed successfully!")


if __name__ == "__main__":
    run_pipeline()
