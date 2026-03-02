# Full Stack Architecture

## 1. Overview

The Mini Carivix platform follows a client-server architecture consisting of:

- React frontend (web + mobile wrapper)
- FastAPI backend
- Supabase for authentication and persistence

![Full Stack Interaction Diagram](https://i.postimg.cc/gjjQxzmG/Full-Stack-Interaction-Diagram.png)

---

## 2. Frontend–Backend Contract

### Communication Model
- HTTP-based REST interaction
- JSON payloads
- Synchronous request-response flow

### Endpoints

| Endpoint | Method | Purpose |
|-----------|--------|----------|
| /analyze | POST | Analyze text query |
| /analyze_file | POST | Analyze uploaded file |

---

## 3. Backend Processing Flow

All processing is synchronous.

Intent Prediction  
→ Entity Extraction  
→ Pandas Data Analysis  
→ Groq LLM API  
→ JSON Response  

If any stage is delayed, the entire request remains pending.

---

## 4. Mobile Integration Layer

- Capacitor wraps the React application.
- Uses same REST endpoints.
- Shares same environment configuration.
- No additional API abstraction layer.

---

## 5. Client–Backend Interaction Model

The frontend establishes two parallel connections:

1. **Backend API**
   - Handles query processing
   - Executes the complete AI pipeline
   - Returns structured analytical responses

2. **Cloud Database & Auth Service**
   - Manages authentication
   - Stores user sessions and interaction history
   - Enforces data isolation and access rules

---

## 6. Request Orchestration Flow

1. User submits a query from the client.
2. The frontend immediately updates the UI (optimistic rendering).
3. The query is sent to the backend API.
4. The backend processes the request internally.
5. The response is returned and rendered in the UI.
6. Interaction data is persisted for session continuity.

![Sequential Request Orchestration Flow](https://i.postimg.cc/XYLPkBJ2/Sequential-Request-Orchestration-Flow.png)

---

## 7. State Handling Strategy

The frontend manages state locally:
- No centralized global state store
- Component-level state management
- Asynchronous handling of backend responses

This approach reduces complexity and improves responsiveness.

---

## 8. Error Handling & Resilience

- Network failures are handled gracefully
- UI remains responsive during backend delays
- Errors are surfaced to users in a controlled manner

---

## 9. Security Responsibilities

- Authentication handled at the frontend service layer
- Authorization enforced via backend and database policies
- Sensitive credentials are never exposed to the client

---

## 10. Related Documentation

- Frontend Overview → `FRONTEND_OVERVIEW.md`
- Backend Overview → `BACKEND_OVERVIEW.md`
- System Architecture → `SYSTEM_ARCHITECTURE.md`