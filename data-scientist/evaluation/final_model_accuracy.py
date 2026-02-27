import json
import numpy as np

ARTIFACT_PATH = "artifacts"


def calculate_final_accuracy():

    # Load metrics saved after training
    with open(f"{ARTIFACT_PATH}/metrics.json", "r") as f:
        metrics = json.load(f)

    print("\nFINAL MODEL ACCURACY (HistGradientRegressor)\n")

    accuracies = []

    for m in metrics:

        target = m["Target"]
        mae = m["MAE"]

        # You must store mean(y_true) during training
        # If not stored, add it once in train_model.py
        mean_true = m.get("Mean_y_true")

        if mean_true is None:
            print(f"{target}: Mean(y_true) not found in metrics.json")
            continue

        accuracy = (1 - (mae / mean_true)) * 100
        accuracies.append(accuracy)

        print(f"{target} Accuracy: {round(accuracy, 2)}%")

    # Final overall accuracy
    if accuracies:
        final_accuracy = np.mean(accuracies)
        print("\nOverall Final Accuracy:", round(final_accuracy, 2), "%")

    return


if __name__ == "__main__":
    calculate_final_accuracy()
