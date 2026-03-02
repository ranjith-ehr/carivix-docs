# Backend Overview – Mini Carivix

## 1. Purpose

The backend serves as the orchestration engine of the Mini Carivix platform.  
It receives client queries and sequentially processes them through:

1. Intent Classification
2. NLP Entity Extraction
3. Deterministic Data Aggregation
4. Machine Learning Forecasting (if required)
5. Structured Response Formatting

---

## 2. Architectural Role

The backend operates as:

- A RESTful API service
- A centralized orchestration hub
- A mediator between frontend and AI components

It abstracts internal pipeline complexity from the client.

![Backend Request Lifecycle Diagram](https://i.postimg.cc/J4nsR5QP/Backend-Request-Lifecycle-Diagram.png)

---

## 3. Request Lifecycle

### Step 1: Request Intake
The backend receives a JSON query payload from the frontend.

### Step 2: Intent Classification
The ML layer determines the analytical intent.

### Step 3: Entity Extraction
The NLP module extracts structured parameters.

### Step 4: Deterministic Aggregation
Data is processed using structured logic and predefined analytics rules.

### Step 5: Forecasting (Conditional)
If intent is predictive, forecasting models generate outputs.

### Step 6: Response Packaging
The final response is assembled and returned to the client.

---

## 4. Model Integration

- Models are loaded during server initialization.
- Inference occurs on demand.
- No retraining occurs during request handling.

This design ensures performance stability and reduced latency.

---

## 5. Logging & Monitoring

The backend logs:

- Incoming query metadata
- Intent confidence scores
- Response generation metrics
- Performance timing information

This enables drift monitoring and operational oversight.

---

## 6. Performance Strategy

- Asynchronous request handling
- Parallel worker configuration
- Efficient model loading strategy
- Controlled response formatting

---

## 7. Security Model (High-Level)

- HTTPS-only access
- Structured error handling
- Authentication managed via application layer
- Production JWT validation recommended

---

## 8. Related Documentation

- API Reference → `API_REFERENCE.md`
- System Architecture → `SYSTEM_ARCHITECTURE.md`
- ML AI Serving → `ML_AI_SERVING.md`