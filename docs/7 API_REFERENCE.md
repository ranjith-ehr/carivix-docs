# API Reference – Mini Carivix

## 1. Overview

This document defines the REST API specifications for the Mini Carivix backend service.  
The API exposes endpoints that process natural language queries and return structured analytical responses.

---

## 2. Base URL

Production Backend:
https://carivix-api-42js4guaza-uc.a.run.app

Interactive API Documentation:
https://carivix-api-42js4guaza-uc.a.run.app/docs

All endpoints are accessible over HTTPS.

---

## 3. Framework & Environment

- API Framework: ASGI-compatible REST framework
- Runtime: Python-based environment
- Server: ASGI production server
- Response Format: JSON

---

## 4. Primary Endpoint

### 4.1 POST `/analyze`

#### Purpose
Processes voice or text queries and returns structured business insights.

#### Request Type
POST

#### Content Type
application/json

---

### 4.2 Request Structure

The endpoint expects a JSON payload containing a natural language query.

![JSON Request Body Example](https://i.postimg.cc/rscMKMW5/JSON-Request-Body.png)

Required Field:
- `query` (string): User’s natural language request

---

### 4.3 Response Structure

The response is a structured JSON object that may contain:

- query
- intent
- confidence score
- intent breakdown
- structured entities
- summary message
- visualization metadata (if applicable)
- computed results

![JSON Response Structure Example](https://i.postimg.cc/FRYD3LbY/JSON-Response-Structure.png)

---

## 5. Supported Intent Categories

The system supports the following intent classifications:

- Prediction
- Comparison
- Trend Analysis
- Summarization

Intent classification determines downstream routing logic.

---

## 6. Health Monitoring Endpoint

### GET `/health`

Purpose:
- Verify backend availability
- Monitor deployment status

Returns a simple system health confirmation response.

---

## 7. Error Handling

The API may return structured error responses for:

- Invalid request body
- Missing required fields
- Unsupported query structure
- Internal processing errors

All errors are returned in JSON format with:
- Status code
- Error message
- Error description (if applicable)

---

## 8. Security & Access

- Communication occurs over HTTPS
- Authentication mechanisms are handled at the application layer
- Production deployments require secure token validation

See:
- `SECURITY_CONSIDERATIONS.md`

---

## 9. Related Documentation

- Backend Overview → `BACKEND_OVERVIEW.md`
- NLP Pipeline → `NLP_PIPELINE.md`
- ML AI Serving → `ML_AI_SERVING.md`