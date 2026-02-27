import pandas as pd
import numpy as np
import json
import os
import joblib
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

ARTIFACT_PATH = "artifacts"
INTENT_MODEL_FILE = f"{ARTIFACT_PATH}/intent_classifier.pkl"


# ============================================================
# TEXT PREPROCESSING
# ============================================================

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# ============================================================
# TRAINING DATA (Simplified but Strong)
# ============================================================

def generate_training_data():

    samples = []

    prediction_phrases = [
        "predict sales",
        "forecast revenue",
        "future profit",
        "what will sales be",
        "estimate next month revenue",
        "sales prediction",
        "expected revenue",
        "upcoming profit forecast"
    ]

    compare_phrases = [
        "compare products",
        "compare regions",
        "product comparison",
        "which product performs better",
        "difference between regions",
        "best performing category",
        "ranking of products",
        "compare performance"
    ]

    trend_phrases = [
        "sales trend",
        "revenue trend",
        "growth over time",
        "how is profit changing",
        "trend analysis",
        "sales pattern",
        "historical performance"
    ]

    summarise_phrases = [
        "executive summary",
        "business overview",
        "financial summary",
        "performance highlights",
        "overall performance report",
        "give me summary"
    ]

    for text in prediction_phrases:
        samples.append({"text": text, "intent": "prediction"})

    for text in compare_phrases:
        samples.append({"text": text, "intent": "compare"})

    for text in trend_phrases:
        samples.append({"text": text, "intent": "trend"})

    for text in summarise_phrases:
        samples.append({"text": text, "intent": "summarise"})

    return pd.DataFrame(samples)

# ============================================================
# TRAIN INTENT CLASSIFIER
# ============================================================

def train_intent_classifier():

    print("=" * 60)
    print("TRAINING INTENT CLASSIFIER (FIXED VERSION)")
    print("=" * 60)

    os.makedirs(ARTIFACT_PATH, exist_ok=True)

    df = generate_training_data()

    df["processed_text"] = df["text"].apply(preprocess_text)

    X = df["processed_text"]
    y = df["intent"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 🔥 ONE VECTORISER ONLY (NO REFITTING)
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words="english"
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )

    classifier.fit(X_train_tfidf, y_train)

    y_pred = classifier.predict(X_test_tfidf)

    accuracy = accuracy_score(y_test, y_pred)

    print(f"\nIntent Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    model_bundle = {
        "vectorizer": vectorizer,
        "classifier": classifier,
        "intents": sorted(df["intent"].unique().tolist()),
        "intent_accuracy": float(accuracy)
    }

    joblib.dump(model_bundle, INTENT_MODEL_FILE)
    print(f"\nModel saved to {INTENT_MODEL_FILE}")

    return model_bundle


# ============================================================
# LOAD MODEL
# ============================================================

def load_intent_classifier():
    if not os.path.exists(INTENT_MODEL_FILE):
        raise FileNotFoundError("Intent model not found. Train it first.")
    return joblib.load(INTENT_MODEL_FILE)


# ============================================================
# PREDICT
# ============================================================

def predict_intent(text):

    model_bundle = load_intent_classifier()
    vectorizer = model_bundle["vectorizer"]
    classifier = model_bundle["classifier"]

    processed_text = preprocess_text(text)

    # 🔥 Rule-based boost
    if any(word in processed_text for word in ["compare", "vs", "difference"]):
        return {"intent": "compare", "confidence": 0.95}

    if any(word in processed_text for word in ["trend", "growth", "pattern"]):
        return {"intent": "trend", "confidence": 0.95}

    if any(word in processed_text for word in ["predict", "forecast", "future"]):
        return {"intent": "prediction", "confidence": 0.95}

    if any(word in processed_text for word in ["summary", "overview", "report"]):
        return {"intent": "summarise", "confidence": 0.95}

    # ML fallback
    X = vectorizer.transform([processed_text])
    intent = classifier.predict(X)[0]
    confidence = float(max(classifier.predict_proba(X)[0]))

    return {
        "intent": intent,
        "confidence": confidence
    }

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    train_intent_classifier()

    print("\nTesting Model...\n")

    test_queries = [
        "predict revenue next month",
        "compare product performance",
        "show sales trend",
        "give executive summary"
    ]

    for query in test_queries:
        result = predict_intent(query)
        print(f"Query: {query}")
        print(f"Intent: {result['intent']} | Confidence: {result['confidence']:.2f}")
        print("-" * 40)