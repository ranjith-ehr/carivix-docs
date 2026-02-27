# NLP Pipeline – Mini Carivix

## 1. Purpose

The NLP pipeline acts as the intelligent bridge between classified intent and structured data retrieval.

It extracts precise entities from natural language queries to enable deterministic analytics.

---

## 2. Processing Flow

The NLP stage follows a four-step pipeline:

1. Token normalization
2. Linguistic parsing
3. Dataset-aware entity matching
4. Time expression extraction

![NLP DATAFLOW PROCESS](https://i.postimg.cc/g0Cr57jJ/NLP-PIPELINE.png)

---

## 3. Entity Extraction Schema

The pipeline extracts structured entities including:

- Region
- Category
- Product
- Metric
- Year
- Quarter
- Relative time reference

Entities are formatted into a structured JSON object for downstream aggregation.

---

## 4. Dataset-Aware Matching

Instead of generic named entity recognition:

- Exact dataset values are dynamically loaded
- Matching is performed against known categories and regions
- Multi-entity queries are supported

This reduces ambiguity and improves retrieval accuracy.

---

## 5. Intent-Based Routing

Routing logic maps classified intent to specific aggregation behaviors:

- Prediction → Forecast generation
- Comparison → Group-based aggregation
- Trend → Time-series breakdown
- Summarization → KPI aggregation

---

## 6. Zero-Computation LLM Contract

All numeric calculations are finalized before passing context to the language model.

The LLM is restricted to:

- Formatting
- Explanation
- Suggestion

It does not perform mathematical computation.

---

## 7. Performance Metrics

The NLP stage tracks:

- Intent accuracy
- Data retrieval success rate
- Structured payload correctness

---

## 8. Related Documentation

- ML AI Serving → `ML_AI_SERVING.md`
- System Architecture → `SYSTEM_ARCHITECTURE.md`
- API Reference → `API_REFERENCE.md`