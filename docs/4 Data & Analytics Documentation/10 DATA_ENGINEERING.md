# Data Engineering – Mini Carivix

## 1. Purpose

This document describes the data engineering layer responsible for transforming raw datasets into clean, validated, and analysis-ready formats.  
This layer serves as the foundation for analytics, machine learning, and downstream processing.

---

## 2. Data Ingestion Sources

The platform ingests multiple datasets to support analytical and forecasting use cases.

Primary sources include:
- Retail business performance data
- Contingency datasets used for pipeline validation and backup analytics

Each dataset is ingested in a raw, unstructured or semi-structured format.

---

## 3. ETL Overview

The data engineering process follows a strict Extract–Transform–Load (ETL) workflow.

![ETL Pipeline Overview Diagram](https://i.postimg.cc/Xqvw5ZRY/ETL-Pipeline-Overview-Diagram.png)

### 3.1 Extract
- Raw datasets are loaded from source files
- Schema validation is performed during ingestion

### 3.2 Transform
Transformation includes:
- Duplicate record removal
- Data type normalization
- Date and time standardization
- Text normalization for categorical fields
- Missing value handling using controlled imputation logic
- Derived metric computation

All transformations are deterministic and repeatable.

### 3.3 Load
- Cleaned datasets are exported for downstream use
- Outputs are generated in both CSV and JSON formats

---

## 4. Derived Metrics

Instead of deferring calculations to later stages, key metrics are computed during data engineering to ensure consistency.

Examples include:
- Profit
- Profit margin
- Aggregated business indicators

This guarantees that all downstream stages operate on a unified data definition.

---

## 5. Output Artifacts

The data engineering layer produces:

- Cleaned CSV datasets for analysis
- Structured JSON datasets for backend and API consumption

These artifacts act as the official data handoff to the next pipeline stages.

---

## 6. Data Quality Controls

Quality is enforced through:
- Schema validation checks
- Null value audits
- Consistency verification
- Controlled transformation rules

No undocumented transformations are permitted.

---

## 7. Handoff Policy

Once datasets are delivered:
- No further mutation is allowed by downstream teams
- All teams consume identical, validated data

---

## 8. Related Documentation

- Data Analysis → `DATA_ANALYSIS.md`
- Data Schemas → `DATA_SCHEMAS.md`
- System Architecture → `SYSTEM_ARCHITECTURE.md`