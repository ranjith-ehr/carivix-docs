# Data Schemas – Mini Carivix

## 1. Purpose

This document defines the structured schemas used for data exchange across pipeline stages.  
These schemas ensure consistent interpretation and processing across teams.

---

## 2. Schema Governance

- Schemas are defined centrally
- Changes require cross-team agreement
- Backward compatibility is prioritized

---

## 3. CSV Dataset Schemas

### 3.1 Business Dataset 

Common fields include:
- Temporal identifiers (year, quarter, date)
- Categorical dimensions (region, category)
- Financial metrics (revenue, cost, expenses, profit)
- Derived indicators (profit margin)

![Business Dataset Schema Table](https://i.postimg.cc/s2Hr9q8B/Business-Dataset-Schema-Table.png)

---

### 3.2 Contingency Dataset (Example)

Common fields include:
- Match or event identifiers
- Participant attributes
- Outcome indicators
- Performance metrics

![Contingency Dataset Schema Table](https://i.postimg.cc/5Nsn0JFD/Contingency-Dataset-Schema-Table.png)

---

## 4. JSON Schema Structure

JSON schemas are designed for API and ML consumption.

Typical characteristics:
- Strong typing
- Nested structures for grouped metrics
- Explicit naming conventions

![JSON Schema Structure](https://i.postimg.cc/x1K85fyq/JSON-Schema-Structure-Diagram.png)

---

## 5. Schema Usage Rules

- No implicit field inference
- No dynamic schema changes at runtime
- All consumers must adhere to published definitions

---

## 6. Versioning Strategy

Schema changes are tracked via:
- Version identifiers
- Changelog entries
- Explicit documentation updates

---

## 7. Related Documentation

- API Reference → `API_REFERENCE.md`
- Data Engineering → `DATA_ENGINEERING.md`
- ML AI Serving → `ML_AI_SERVING.md`