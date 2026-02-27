# System Architecture – Mini Carivix

## 1. Architecture Overview

Mini Carivix is designed as a modular, cloud-hosted, service-oriented platform that transforms natural language queries into structured business insights.  
Each system layer is isolated by responsibility to ensure scalability, maintainability, and deterministic behavior.

The architecture follows a **sequential processing pipeline** exposed through a single backend API endpoint and consumed by a lightweight frontend client.

![High-Level System Architecture Diagram](https://i.postimg.cc/02xgZ1Gz/High-Level-System-Architecture-Diagram.png)

---

## 2. Architectural Principles

### 2.1 Modular Separation
Each functional stage operates independently:
- Data Engineering
- Data Analysis
- Data Science
- ML / AI Serving
- NLP Processing
- Full Stack Orchestration
- Cloud Infrastructure

This separation prevents cross-layer dependency leakage and simplifies debugging and evaluation.

### 2.2 Deterministic Computation
All numerical calculations are performed before interaction with generative components.  
The system enforces a **Zero-Computation LLM Contract**, ensuring reliability and preventing numeric hallucinations.

### 2.3 Single Entry Point
The backend exposes a unified API endpoint that internally orchestrates all downstream processing stages.

---

## 3. High-Level Component Flow

The system operates through the following sequential flow:

1. User submits a voice or text query via the frontend.
2. Frontend sends the request to the backend API.
3. Backend triggers intent classification.
4. NLP layer extracts structured entities.
5. Deterministic data aggregation is performed.
6. Machine learning models generate predictions if required.
7. Structured results are passed to the language model for explanation only.
8. Final response is returned to the frontend for rendering.

![Request Lifecycle Flow Diagram](https://i.postimg.cc/RVHh8D0j/Request-Life-Cycle-Flow-Diagram.png)

---

## 4. Backend Architecture

### 4.1 API Layer
- Acts as the orchestration hub
- Receives all client requests
- Manages the sequential processing pipeline
- Returns unified JSON responses

### 4.2 Intent Classification
- Determines the analytical intent of the query
- Routes the request to the appropriate logic path
- Supported intents include prediction, comparison, trend, and summarization

### 4.3 NLP & Entity Extraction
- Extracts dataset-aware entities such as metrics, regions, products, and timeframes
- Uses linguistic parsing and rule-based matching
- Outputs structured parameters for analytics

---

## 5. Data & Analytics Architecture

### 5.1 Data Engineering Layer
- Handles ingestion of raw datasets
- Performs cleaning, validation, and transformation
- Outputs structured CSV and JSON artifacts

### 5.2 Data Analysis Layer
- Consumes cleaned datasets without modification
- Generates KPIs and analytical groupings
- Prepares visualization-ready outputs

### 5.3 Data Science Layer
- Performs feature engineering
- Trains and evaluates forecasting models
- Produces serialized model artifacts and prediction outputs

---

## 6. Machine Learning & AI Serving Architecture

### 6.1 Model Serving
- Models are loaded at server startup
- Inference is performed on demand
- Latency is optimized through asynchronous request handling

### 6.2 Monitoring & Logging
- Prediction confidence and input distributions are logged
- Supports model drift detection
- Enables auditability and performance tracking

---

## 7. Frontend Architecture

### 7.1 Client Design
- Handles authentication, session persistence, and UI state
- Implements optimistic UI patterns to manage backend latency

### 7.2 API Consumption
- Frontend communicates only with the backend API
- Downstream services are abstracted from the client
- Visualization rendering is driven by backend-provided metadata

---

## 8. Cloud Deployment Architecture

### 8.1 Hosting Model
- Backend and frontend are deployed as cloud-hosted services
- Public endpoints are exposed over HTTPS
- API documentation is served directly from the backend

![Cloud Deployment Architecture Diagram](https://i.postimg.cc/qqs4v8nj/Deployment-Architecture-Overview.png)

### 8.2 Environment Isolation
- Configuration managed via environment variables
- Clear separation between development and production environments

---

## 9. Security Architecture (High-Level)

- Authentication handled at the frontend service layer
- API access controlled through managed credentials
- Logging enabled for monitoring and audit purposes
- Production hardening requirements documented separately

See:
- `SECURITY_CONSIDERATIONS.md`

---

## 10. Related Documentation

- Project Overview → `PROJECT_OVERVIEW.md`
- Backend Overview → `BACKEND_OVERVIEW.md`
- API Reference → `API_REFERENCE.md`
- NLP Pipeline → `NLP_PIPELINE.md`
- ML / AI Serving → `ML_AI_SERVING.md`
- Deployment Guide → `DEPLOYMENT_GUIDE.md`