# Full Stack Architecture – Mini Carivix

## 1. Purpose

This document explains how the frontend client and backend services are integrated to deliver an end-to-end user experience.  
The full stack layer acts as the orchestration point between the user interface, backend APIs, authentication services, and data persistence layers.

---

## 2. Architectural Approach

Mini Carivix follows a **Direct REST + Backend-as-a-Service (BaaS)** architecture.

Key characteristics:
- No traditional API Gateway or GraphQL layer
- Frontend communicates directly with backend services
- Backend internally orchestrates all AI and analytics stages

![Full Stack Interaction Diagram](https://i.postimg.cc/gjjQxzmG/Full-Stack-Interaction-Diagram.png)

---

## 3. Client–Backend Interaction Model

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

## 4. Request Orchestration Flow

1. User submits a query from the client.
2. The frontend immediately updates the UI (optimistic rendering).
3. The query is sent to the backend API.
4. The backend processes the request internally.
5. The response is returned and rendered in the UI.
6. Interaction data is persisted for session continuity.

![Sequential Request Orchestration Flow](https://i.postimg.cc/XYLPkBJ2/Sequential-Request-Orchestration-Flow.png)

---

## 5. State Handling Strategy

The frontend manages state locally:
- No centralized global state store
- Component-level state management
- Asynchronous handling of backend responses

This approach reduces complexity and improves responsiveness.

---

## 6. Error Handling & Resilience

- Network failures are handled gracefully
- UI remains responsive during backend delays
- Errors are surfaced to users in a controlled manner

---

## 7. Security Responsibilities

- Authentication handled at the frontend service layer
- Authorization enforced via backend and database policies
- Sensitive credentials are never exposed to the client

---

## 8. Related Documentation

- Frontend Overview → `FRONTEND_OVERVIEW.md`
- Backend Overview → `BACKEND_OVERVIEW.md`
- System Architecture → `SYSTEM_ARCHITECTURE.md`