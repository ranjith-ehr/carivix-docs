import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from ner import extract_entities

# -------------------------------------------------
# LOAD DATASET
# -------------------------------------------------
dataset = pd.read_csv("business_dataset_cleaned_1500_rows1.csv")

# -------------------------------------------------
# LOAD YOUR REAL INTENT CLASSIFIER
# -------------------------------------------------
model_bundle = joblib.load("artifacts/intent_classifier.pkl")

vectorizer = model_bundle["vectorizer"]
classifier = model_bundle["classifier"]

# -------------------------------------------------
# INTENT PREDICTION
# -------------------------------------------------
def predict_intent(text):
    X = vectorizer.transform([text])
    return classifier.predict(X)[0]

# -------------------------------------------------
# FILTER LOGIC (Same as pipeline)
# -------------------------------------------------
def apply_filters(df, entities):

    if entities.get("product"):
        df = df[df["product_name"] == entities["product"]]

    if entities.get("category"):
        df = df[df["category"] == entities["category"]]

    if entities.get("region"):
        df = df[df["region"] == entities["region"]]

    if entities.get("quarter"):
        df = df[df["quarter"] == f"Q{entities['quarter']}"]

    if entities.get("year"):
        df = df[df["year"] == entities["year"]]

    return df

# -------------------------------------------------
# TEST QUERIES (Add More For Better Evaluation)
# -------------------------------------------------
test_cases = [
    ("sales of laptop in q1", "prediction"),
    ("profit of mobile in q3 2023", "prediction"),
    ("compare sales of laptop and mobile in q2", "prediction"),
    ("show revenue trend", "trend"),
    ("give executive summary", "summarise"),
]

true_labels = []
predicted_labels = []

data_success = 0

for query, expected_intent in test_cases:

    predicted_intent = predict_intent(query)

    true_labels.append(expected_intent)
    predicted_labels.append(predicted_intent)

    # Check data retrieval success
    entities = extract_entities(query)
    filtered_df = apply_filters(dataset.copy(), entities)

    if len(filtered_df) > 0:
        data_success += 1

# -------------------------------------------------
# RESULTS
# -------------------------------------------------
intent_accuracy = accuracy_score(true_labels, predicted_labels)
data_success_rate = data_success / len(test_cases)

print("\n==============================")
print("FULL PIPELINE EVALUATION")
print("==============================\n")

print(f"Intent Accuracy: {intent_accuracy:.2f}")
print(f"Data Retrieval Success Rate: {data_success_rate:.2f}")
print(f"Overall system Score: {(intent_accuracy + data_success_rate)/2:.2f}\n")

