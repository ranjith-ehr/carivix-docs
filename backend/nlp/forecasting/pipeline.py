import joblib
import pandas as pd
from asr import speech_to_text
from ner import extract_entities
from rag_llm import generate_response
from tts import speak
from models.intent_classifier import preprocess_text

# -------------------------------------------------
# LOAD MODEL
# -------------------------------------------------
intent_bundle = joblib.load("artifacts/intent_classifier.pkl")
vectorizer = intent_bundle["vectorizer"]
classifier = intent_bundle["classifier"]

# -------------------------------------------------
# LOAD DATASET
# -------------------------------------------------
dataset = pd.read_csv("business_dataset_cleaned_1500_rows1.csv")
dataset["date"] = pd.to_datetime(dataset["date"])


# -------------------------------------------------
# INTENT (non-blocking)
# -------------------------------------------------
def predict_intent(text):
    processed = preprocess_text(text)
    X = vectorizer.transform([processed])
    pred = classifier.predict(X)[0]
    conf = float(max(classifier.predict_proba(X)[0]))
    return pred, conf


# -------------------------------------------------
# MAP METRIC
# -------------------------------------------------
def map_metric(metric_name):

    if not metric_name:
        return None

    if metric_name == "sales":
        return "sales_amount"

    if metric_name == "revenue":
        return "revenue"

    if metric_name == "profit":
        return "profit"

    if metric_name == "customer":
        return "customer_count"

    return None


# -------------------------------------------------
# APPLY FILTERS
# -------------------------------------------------
def apply_filters(df, entities):

    # REGION
    if entities.get("region"):
        df = df[df["region"] == entities["region"]]

    # CATEGORY
    if entities.get("category"):
        df = df[df["category"] == entities["category"]]

    # EXPLICIT YEAR
    if entities.get("year"):
        df = df[df["year"] == entities["year"]]

    # TIME REFERENCE
    if entities.get("time_reference") == "last_year":
        df = df[df["year"] == df["year"].max() - 1]

    if entities.get("time_reference") == "this_year":
        df = df[df["year"] == df["year"].max()]

    # QUARTER
    if entities.get("quarter"):
        df = df[df["quarter"] == f"Q{entities['quarter']}"]

    return df


# -------------------------------------------------
# SMART RECOVERY
# -------------------------------------------------
def smart_recovery(entities):

    relaxed_df = dataset.copy()

    if entities.get("product"):
        relaxed_df = relaxed_df[
            relaxed_df["product_name"] == entities["product"]
        ]

    if entities.get("year"):
        relaxed_df = relaxed_df[
            relaxed_df["year"] == entities["year"]
        ]

    if len(relaxed_df) > 0:
        return {
            "info": "No data for requested quarter.",
            "available_quarters": sorted(
                relaxed_df["quarter"].unique().tolist()
            )
        }

    return {"info": "No matching records found."}


# -------------------------------------------------
# MAIN
# -------------------------------------------------
def run():

    mode = input("Input type (t/v): ")
    user_text = speech_to_text() if mode == "v" else input("Enter text: ")

    if not user_text:
        print("No input detected")
        return

    intent, confidence = predict_intent(user_text)
    print(f"\nPredicted Intent: {intent} (confidence: {confidence:.2f})")

    entities = extract_entities(user_text)
    print("Detected Entities:", entities)

    metric_column = map_metric(entities.get("metric"))

    base_df = apply_filters(dataset.copy(), entities)

    data = None

    # -------------------------------------------------
    # 🔥 COMPARISON LOGIC
    # -------------------------------------------------
    if "compare" in user_text.lower() and entities.get("products"):

        compare_df = base_df[
            base_df["product_name"].isin(entities["products"])
        ]

        if len(compare_df) == 0:
            data = {"info": "No matching comparison records found."}

        else:
            comparison_result = (
                compare_df.groupby("product_name")[metric_column]
                .sum()
                .to_dict()
            )

            data = {
                "comparison": comparison_result,
                "metric": metric_column
            }

    # -------------------------------------------------
    # SINGLE PRODUCT AGGREGATION
    # -------------------------------------------------
    elif metric_column:

        if entities.get("product"):
            base_df = base_df[
                base_df["product_name"] == entities["product"]
            ]

        if len(base_df) == 0:
            data = smart_recovery(entities)
        else:
            total_value = base_df[metric_column].sum()

            data = {
                "metric": metric_column,
                "rows_matched": int(len(base_df)),
                "value": float(total_value)
            }

    else:
        print("Metric not detected → Switching to RAG")
        intent = "rag"
        data = None

    # -------------------------------------------------
    # LLM FORMATTING
    # -------------------------------------------------
    context = f"""
Intent: {intent}
Intent Confidence: {confidence:.2f}
Entities: {entities}
Structured Data: {data}

IMPORTANT:
Use only structured data values.
If comparison, clearly compare values.
Do NOT invent numbers.
"""

    response = generate_response(user_text, intent, entities, context)

    print("\nAssistant:", response)

    if input("Voice output? (y/n): ") == "y":
        speak(response)


if __name__ == "__main__":
    run()