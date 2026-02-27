import spacy
import re
import pandas as pd

# -------------------------------------------------
# LOAD SPACY
# -------------------------------------------------
nlp = spacy.load("en_core_web_sm")

# -------------------------------------------------
# LOAD DATASET FOR DYNAMIC ENTITY DETECTION
# -------------------------------------------------
dataset = pd.read_csv("business_dataset_cleaned_1500_rows1.csv")

regions = dataset["region"].dropna().unique()
categories = dataset["category"].dropna().unique()
products = dataset["product_name"].dropna().unique()

# -------------------------------------------------
# ENTITY EXTRACTION FUNCTION
# -------------------------------------------------
def extract_entities(text):

    doc = nlp(text.lower())
    q = text.lower()

    entities = {
        "region": None,
        "category": None,
        "product": None,
        "products": [],
        "metric": None,
        "year": None,
        "quarter": None,
        "time_reference": None
    }

    # -------------------------------------------------
    # METRIC DETECTION
    # -------------------------------------------------
    if "sales" in q:
        entities["metric"] = "sales"
    elif "revenue" in q:
        entities["metric"] = "revenue"
    elif "profit" in q:
        entities["metric"] = "profit"
    elif "customer" in q:
        entities["metric"] = "customer"

    # -------------------------------------------------
    # REGION DETECTION
    # -------------------------------------------------
    for r in regions:
        if str(r).lower() in q:
            entities["region"] = r
            break

    # -------------------------------------------------
    # CATEGORY DETECTION
    # -------------------------------------------------
    for c in categories:
        if str(c).lower() in q:
            entities["category"] = c
            break

    # -------------------------------------------------
    # MULTI-PRODUCT DETECTION
    # -------------------------------------------------
    for p in products:
        if p.lower() in q:
            entities["products"].append(p)

    if len(entities["products"]) == 1:
        entities["product"] = entities["products"][0]
    else:
        entities["product"] = None

    # -------------------------------------------------
    # YEAR DETECTION (Explicit like 2023)
    # -------------------------------------------------
    year_match = re.search(r"\b(20\d{2})\b", q)
    if year_match:
        entities["year"] = int(year_match.group(1))

    # -------------------------------------------------
    # TIME REFERENCE
    # -------------------------------------------------
    if "last year" in q:
        entities["time_reference"] = "last_year"

    if "this year" in q:
        entities["time_reference"] = "this_year"

    # -------------------------------------------------
    # QUARTER DETECTION (Q1 Q2 Q3 Q4)
    # -------------------------------------------------
    quarter_match = re.search(r"q([1-4])", q)
    if quarter_match:
        entities["quarter"] = int(quarter_match.group(1))

    return entities