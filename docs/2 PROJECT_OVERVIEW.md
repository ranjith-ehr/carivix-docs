# Project Overview – Mini Carivix

## 1. Executive Summary

Mini Carivix is a voice-driven business insight platform engineered to transform natural language queries into structured analytical outputs. The system integrates data engineering, machine learning, natural language processing (NLP), and full stack orchestration to deliver intent-aware insights in real time.

The platform is designed to:

- Interpret user voice or text queries
- Classify analytical intent
- Extract structured entities
- Perform deterministic data aggregation
- Generate visual and textual summaries
- Return structured API responses

Mini Carivix emphasizes architectural clarity, modular separation of responsibilities, and production readiness.

---

## 2. Project Objectives

The primary objectives of the Mini Carivix platform are:

### 2.1 Business Intelligence Accessibility
Enable non-technical users to access business insights using natural language instead of structured query languages or traditional BI tools.

### 2.2 Deterministic Analytics
Ensure all numerical computations are performed by controlled data pipelines, enforcing a Zero-Computation LLM Contract.

### 2.3 Modular AI Pipeline
Design a clear separation between:
- Data Engineering
- Data Analysis
- Data Science
- ML/AI Serving
- NLP Processing
- Full Stack Integration
- Cloud Deployment

### 2.4 Production-Ready Deployment
Deploy the system as a cloud-hosted, scalable API and frontend application suitable for real-world usage.

---

## 3. Platform Scope

Mini Carivix consists of the following major functional layers:

### 3.1 Data Engineering Layer
Responsible for:
- Data ingestion
- Data cleaning
- Missing value handling
- Derived metric calculations
- Structured dataset export (CSV and JSON)

### 3.2 Data Analysis Layer
Responsible for:
- KPI identification
- Exploratory data analysis
- Visualization logic
- Zero-mutation validation policy

### 3.3 Data Science Layer
Responsible for:
- Time-series feature engineering
- Model experimentation and selection
- Forecast generation
- Performance evaluation
- Artifact serialization

### 3.4 ML/AI Engineering Layer
Responsible for:
- Model serving via REST API
- Intent classification
- API endpoint exposure
- Latency optimization
- Monitoring and logging

### 3.5 NLP & Entity Extraction Layer
Responsible for:
- Token normalization
- Linguistic parsing
- Dataset-aware entity extraction
- Intent-based routing
- Structured JSON payload generation

### 3.6 Full Stack Layer
Responsible for:
- Client-side orchestration
- Authentication and session handling
- API integration
- Visualization rendering
- Optimistic UI handling

### 3.7 Cloud & Deployment Layer
Responsible for:
- Hosting backend services
- Deploying frontend application
- API documentation exposure
- Environment management

---

## 4. System Philosophy

Mini Carivix follows several strict architectural principles:

### 4.1 Zero-Mutation Data Policy
The Data Analyst stage does not modify upstream datasets.

### 4.2 Zero-Computation LLM Contract
All numeric calculations are completed before LLM interaction.  
The LLM is used strictly for:
- Explanation
- Formatting
- Suggestion

### 4.3 Deterministic Intent Routing
Intent classification determines the aggregation logic path before any response is generated.

### 4.4 Modular Isolation
Each team operates within clearly defined boundaries to prevent cross-stage data corruption.

---

## 5. Core Functional Capabilities

The platform supports the following analytical interactions:

- Metric prediction (e.g., future sales forecasting)
- Product or category comparison
- Trend analysis over time
- KPI summarization
- Visualization generation
- Structured API-based output

---

## 6. Deployment Overview

Mini Carivix is deployed as a cloud-hosted application.

- Backend API Service
- Frontend Application
- Public API Documentation Interface

![Deployment Architecture Overview](https://i.postimg.cc/qqs4v8nj/Deployment-Architecture-Overview.png)

Deployment details are documented in `DEPLOYMENT_GUIDE.md`.

---

## 7. Intended Use Cases

Mini Carivix is suitable for:

- Business performance forecasting
- Sales and revenue comparison
- Regional analysis
- Educational demonstration of AI pipeline orchestration
- Academic project evaluation

---

## 8. Related Documentation

For deeper exploration of specific layers:

- System Architecture → `SYSTEM_ARCHITECTURE.md`
- API Reference → `API_REFERENCE.md`
- Data Engineering → `DATA_ENGINEERING.md`
- Data Science Pipeline → `DATA_SCIENCE_PIPELINE.md`
- NLP Pipeline → `NLP_PIPELINE.md`
- ML/AI Serving → `ML_AI_SERVING.md`
- Deployment Guide → `DEPLOYMENT_GUIDE.md`