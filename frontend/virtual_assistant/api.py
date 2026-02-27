from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pipeline import predict_intent, extract_entities, map_metric, apply_filters, dataset, smart_recovery, generate_response
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: Request):
    body = await request.json()
    user_text = body.get("query", "")
    text_lower = user_text.strip().lower()
    
    # Handle simple greetings
    import string
    clean_text = text_lower.translate(str.maketrans('', '', string.punctuation))
    greetings_set = {"hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "hi there", "hello there"}
    
    if clean_text in greetings_set:
        return {
            "intent": "GREETING",
            "entities": [],
            "response": {"message": "Hello! I am your AI Business Assistant. How can I help you visualize and analyze your data today?"},
            "ai_analysis": "Greeting the user.",
            "chart_type": "bar"
        }
    
    intent, confidence = predict_intent(user_text)
    entities = extract_entities(user_text)
    metric_column = map_metric(entities.get("metric"))
    
    if not metric_column:
        metric_column = "sales_amount" # default to track something if not found
    
    base_df = apply_filters(dataset.copy(), entities)
    data = None
    structured_res = {}
    chart_type = "bar"
    mapped_intent = "INFO"
    
    if "compare" in user_text.lower() and entities.get("products"):
        compare_df = base_df[base_df["product_name"].isin(entities["products"])]
        if len(compare_df) == 0:
            data = {"info": "No matching comparison records found."}
        else:
            comparison_result = compare_df.groupby("product_name")[metric_column].sum().to_dict()
            data = {"comparison": comparison_result, "metric": metric_column}
            structured_res = {"summary": comparison_result}
            mapped_intent = "COMPARE"
            chart_type = "bar"
    else:
        if entities.get("product"):
            base_df = base_df[base_df["product_name"] == entities["product"]]
        if len(base_df) == 0:
            data = smart_recovery(entities)
        else:
            total_value = base_df[metric_column].sum()
            data = {"metric": metric_column, "rows_matched": int(len(base_df)), "value": float(total_value)}
            
            # Group by dimension
            if "region" in entities:
                dim = "category"
            else:
                dim = "region"

            # Check if asking for time-based aggregation
            if "last" in user_text.lower() or "month" in user_text.lower() or "year" in user_text.lower() or "trend" in user_text.lower():
                if 'month' in base_df.columns:
                    dim = 'month'
                    chart_type = "line"
                    mapped_intent = "TREND"
            
            group_df = base_df.groupby(dim).agg(
                value=(metric_column, "sum"),
                sales=("sales_amount", "sum") if "sales_amount" in base_df.columns else (metric_column, "sum"),
                profits=("profit", "sum") if "profit" in base_df.columns else (metric_column, "sum")
            ).reset_index()

            if len(group_df) > 0:
                summary_array = []
                for _, row in group_df.iterrows():
                    val = float(row["value"])
                    summary_array.append({
                        "name": str(row[dim]),
                        "value": val,
                        "Sales_units": float(row["sales"]),
                        "Profit": float(row["profits"]),
                        "size": val,               # For treemap
                        "x": float(row["sales"]),  # For scatter
                        "y": float(row["profits"]) # For scatter
                    })
                
                structured_res = {"summary": summary_array}
                if mapped_intent == "INFO":
                    mapped_intent = "SUMMARIZE"
                    chart_type = "pie" if len(group_df) <= 3 else "bar"

    # User input explicitly requesting a chart type overrides default chart selection
    text_lower = user_text.lower()
    
    # Check comprehensive mappings and override intents
    if "candlestick" in text_lower or "price range" in text_lower:
        chart_type = "candlestick"
        mapped_intent = "PREDICT"
    elif "smooth line" in text_lower or "smooth_line" in text_lower or "smoothed forecast" in text_lower:
        chart_type = "smooth_line"
        mapped_intent = "PREDICT"

    elif "stacked bar" in text_lower or "stacked_bar" in text_lower or "composition" in text_lower:
        chart_type = "stacked_bar"
        mapped_intent = "COMPARE"
    elif "grouped bar" in text_lower or "grouped_bar" in text_lower or "side-by-side" in text_lower:
        chart_type = "grouped_bar"
        mapped_intent = "COMPARE"
    elif "bubble" in text_lower:
        chart_type = "bubble_chart"
        mapped_intent = "COMPARE"
    elif "heatmap" in text_lower:
        chart_type = "heatmap"
        mapped_intent = "COMPARE"
    elif "radar" in text_lower or "multi-dimensional" in text_lower:
        chart_type = "radar"
        mapped_intent = "COMPARE"
    elif "pie" in text_lower or "distribution" in text_lower:
        chart_type = "pie"
        mapped_intent = "COMPARE"

    elif "multi line" in text_lower or "multi_line" in text_lower or "multiple trend" in text_lower:
        chart_type = "multi_line"
        mapped_intent = "TREND"
    elif "step chart" in text_lower or "step_chart" in text_lower or "quarterly change" in text_lower:
        chart_type = "step_chart"
        mapped_intent = "TREND"
    elif "sparkline" in text_lower or "compact trend" in text_lower:
        chart_type = "sparkline"
        mapped_intent = "TREND"
    elif "seasonal" in text_lower:
        chart_type = "seasonal"
        mapped_intent = "TREND"
    elif "area" in text_lower or "cumulative" in text_lower or "trend volume" in text_lower:
        chart_type = "area"
        mapped_intent = "TREND"

    elif "dashboard" in text_lower or "executive overview" in text_lower:
        chart_type = "dashboard"
        mapped_intent = "SUMMARIZE"
    elif "kpi gauge" in text_lower or "kpi" in text_lower or "gauge" in text_lower:
        chart_type = "kpi_gauge"
        mapped_intent = "SUMMARIZE"
    elif "mini chart" in text_lower or "mini_chart" in text_lower or "grid" in text_lower:
        chart_type = "mini_charts"
        mapped_intent = "SUMMARIZE"
    elif "scorecard" in text_lower or "performance metric" in text_lower:
        chart_type = "scorecard"
        mapped_intent = "SUMMARIZE"
    elif "bullet" in text_lower or "target vs actual" in text_lower:
        chart_type = "bullet_chart"
        mapped_intent = "SUMMARIZE"
    elif "funnel" in text_lower or "conversion" in text_lower:
        chart_type = "funnel"
        mapped_intent = "SUMMARIZE"
    elif "treemap" in text_lower or "tree map" in text_lower:
        chart_type = "treemap"
        mapped_intent = "SUMMARIZE"

    elif "line" in text_lower or "forecast" in text_lower:
        chart_type = "line"
        mapped_intent = "TREND" if "trend" in text_lower else "PREDICT"
    elif "bar" in text_lower or "ranking" in text_lower:
        chart_type = "bar"
        mapped_intent = "COMPARE"
    elif "scatter" in text_lower:
        chart_type = "scatter"

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

    response_text = generate_response(user_text, intent, entities, context)
    
    # If groq fails or returns nothing, fallback
    if not response_text:
        response_text = f"Analyzed your query related to {intent}. The total value found is {data.get('value', 'unknown')} for metric {metric_column}."
    
    return {
        "intent": mapped_intent,
        "entities": list(entities.keys()),
        "response": structured_res if structured_res else {"message": response_text},
        "ai_analysis": response_text,
        "chart_type": chart_type
    }
