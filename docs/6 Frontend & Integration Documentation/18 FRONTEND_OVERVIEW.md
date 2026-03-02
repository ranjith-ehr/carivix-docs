# Frontend Overview

## 1. Introduction

The frontend application provides the primary user interface for interacting with the Mini Carivix platform. It enables users to submit analytical queries, upload datasets, and receive AI-driven insights in real time.

The application follows a component-driven architecture with clear separation between presentation, state management, and service logic.

---

## 2. Framework and Technology Stack

### Client Application Framework
- React (v18.3.1)
- Vite (v7.3.1)
- TypeScript

### Styling & UI
- Tailwind CSS
- Lucide React (Icon Library)
- Recharts (Data Visualization)

### Mobile Support
- Capacitor (Wraps the React application as a native Android/iOS app)

---

## 3. Architecture Principles

- Minimal routing complexity
- Component-driven design
- Clear separation between UI and service logic
- Environment-based backend configuration
- Graceful error handling

![Frontend Component Structure](https://i.postimg.cc/xCZDyJsY/Frontend-Component-Structure.png)

---

## 4. Backend Communication Strategy

### FastAPI Backend

**Service File:** `src/services/aiService.ts`  
**Directory:** `virtual_assistant`

### Communication Method
- Uses native `fetch()` API
- HTTP POST requests
- Asynchronous handling using `await`

### Endpoints
- `${VITE_API_URL}/analyze` → Text query analysis
- `${VITE_API_URL}/analyze_file` → File (Excel/CSV) analysis

### Payload Types
- JSON → Text queries
- FormData → File uploads

### Environment Configuration
Backend URL is read from:
VITE_API_URL
> Default fallback: localhost


---

## 5. Supabase Integration

Supabase is used for:

- User authentication
- Persistent storage (chat history, sessions)
- Real-time synchronization

Communication is handled via `@supabase/supabase-js`.

---

## 6. Offline, Latency & Failure Handling

### Offline or Backend Unreachable

- All network calls are wrapped in `try...catch`
- Returns `"ERROR"` state
- Displays user-friendly message:
  
  > "Could not connect to the analysis engine API."

- UI uses alerts or toast notifications
- Application does not crash

### High Latency Handling

- No custom timeout is defined
- Browser default timeout (approx. 30–60 seconds)
- `isLoading = true` during request
- Loading animation displayed until response resolves

---

## 7. Mobile Behavior

The same frontend codebase is wrapped using Capacitor.  
No separate backend or API layer exists for mobile.

---

## 8. Related Documentation

- User Guide → `USER_GUIDE.md`
- Full Stack Architecture → `FULL_STACK_ARCHITECTURE.md`
- API Reference → `API_REFERENCE.md`