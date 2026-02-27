# Mini Carivix — Architecture & Integration Q&A

## 1. How are you integrating the sequential API calls from the ML, NLP, and GIS microservices?

Mini Carivix integrates ML, NLP, and AI services through a **single unified Python backend pipeline** (`virtual_assistant/pipeline.py` and `virtual_assistant/api.py`) that orchestrates all processing steps **sequentially inside one FastAPI endpoint** (`POST /analyze`).

### The Sequential Flow

When a user submits a natural-language query, the following steps execute in order inside `api.py`:

```
User Query (text)
      │
      ▼
[Step 1 — NLP: Named Entity Recognition]
      ner.py → extract_entities(user_text)
      (spaCy en_core_web_sm + custom regex rules)
      Extracts: region, category, product, metric, year, quarter, time_reference
      │
      ▼
[Step 2 — ML: Intent Classification]
      pipeline.py → predict_intent(user_text)
      (pre-trained scikit-learn classifier loaded from artifacts/intent_classifier.pkl)
      Predicts: COMPARE | TREND | SUMMARIZE | PREDICT | INFO | GREETING
      │
      ▼
[Step 3 — Data Filtering & Aggregation]
      pipeline.py → map_metric(entities) → apply_filters(dataset, entities)
      (pandas operations on the business_dataset_cleaned_1500_rows1.csv)
      │
      ▼
[Step 4 — LLM Response (RAG-style)]
      rag_llm.py → generate_response(user_text, intent, entities, context)
      (Groq API → LLaMA 3.1 8B Instant model)
      │
      ▼
[Step 5 — Chart Type Selection]
      api.py → keyword-based override logic
      Determines: bar | line | pie | area | scatter | treemap | heatmap | etc.
      │
      ▼
Unified JSON Response: { intent, entities, response, ai_analysis, chart_type }
```

> **GIS Note:** Geographic location data is captured at the **authentication layer** (during login/signup via `authService.ts`). The user's `{ lat, lng }` is stored in Supabase user metadata and recorded in a `login_history` table via `userService.recordLogin()`. This makes GIS data an ambient context layer rather than a real-time microservice call in the query pipeline.

### Key Code Reference

```python
# virtual_assistant/api.py — Lines 35–37 (sequential calls)
intent, confidence = predict_intent(user_text)   # ML step
entities = extract_entities(user_text)            # NLP step
metric_column = map_metric(entities.get("metric")) # Data mapping
```

---

## 2. Are you building an API Gateway or using GraphQL to serve this aggregated data to the client applications?

**Neither GraphQL nor a dedicated API Gateway is used.** The project uses a **direct REST architecture** with two separate backends accessed independently by the frontend:

### Architecture Overview

```
React + TypeScript Frontend (Vite, port 5173)
        │
        ├──► FastAPI Backend (port 8000)         [AI / Analytics]
        │         POST /analyze
        │         (src/services/aiService.ts → fetch('http://localhost:8000/analyze'))
        │
        └──► Supabase (cloud BaaS)               [Auth + Database]
                  supabase.auth.*                 (Authentication)
                  supabase.from('chats').*        (Chat CRUD)
                  supabase.from('messages').*     (Message persistence)
                  supabase.from('login_history')  (GIS/location data)
```

### Why Not GraphQL?

The project uses a **typed REST + BaaS approach** because:
- The query shape is simple and predictable (single POST endpoint for AI analysis).
- Supabase's JavaScript SDK (`@supabase/supabase-js v2`) provides a fluent, type-safe query builder that behaves similarly to GraphQL (field selection, filtering, ordering) without the added complexity of a GraphQL schema.

### Key Code Reference

```typescript
// src/services/aiService.ts — Direct REST call to FastAPI
const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
});

// src/services/chatService.ts — Supabase SDK (BaaS layer)
const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('timestamp', { ascending: true });
```

---

## 3. What frontend framework are you using, and how is state management handled when waiting for the AI and map data to load?

### Frontend Framework

| Layer | Technology |
|---|---|
| Framework | **React 18.3.1** (with **TypeScript 5.5.3**) |
| Build Tool | **Vite** |
| Styling | **Tailwind CSS** |
| Routing | **Custom single-page state switch** (`App.tsx` → `renderPage()`) |
| UI Icons | `lucide-react` |

There is **no external routing library** (no React Router). Navigation is handled through a `currentPage` state variable in `App.tsx` that conditionally renders page components.

### State Management Strategy

The project uses **React's built-in `useState` and `useEffect` hooks** exclusively — no Redux, Zustand, or Context API. State is lightly co-located at the component level, primarily inside `Home.tsx`.

#### Key State Variables in `Home.tsx`

| State Variable | Purpose |
|---|---|
| `messages` | Current chat message list (synced with Supabase) |
| `previousChats` | Sidebar chat history list |
| `selectedChatId` | Currently open chat session |
| `inputMessage` | Controlled textarea input value |
| `isListening` | Voice input active flag |
| `showScrollButton` | Scroll-to-bottom button visibility |
| `showDeleteModal` | Delete confirmation modal open/closed |
| `isDark` | Tracks `document.documentElement.classList` for theme |

#### Handling Async Loading (AI + Data)

Since there is no global loading spinner library, the **optimistic UI pattern** is used:

```typescript
// src/pages/Home.tsx — handleSendMessage()

// 1. User message is saved to Supabase and rendered immediately (optimistic)
const savedUserMsg = await chatService.sendMessage(currentChatId, userMessage);
if (savedUserMsg) setMessages((prev) => [...prev, savedUserMsg]);

// 2. Input is cleared — UI stays responsive while AI processes
setInputMessage('');

// 3. AI backend call is awaited (async, non-blocking to rest of UI)
const aiResponse = await aiService.analyzeQuery(query);

// 4. Bot response is saved + rendered after AI returns
const savedBotMsg = await chatService.sendMessage(currentChatId, botMessage);
if (savedBotMsg) setMessages((prev) => [...prev, savedBotMsg]);
```

**Theme state** is tracked reactively using a `MutationObserver` watching the `<html>` element's `class` attribute, so the delete modal and other UI components respond instantly to dark/light mode without a global store.

---

## 4. What are the authentication and authorization protocols for accessing these endpoints?

### Authentication — Supabase Auth (JWT-based)

Authentication is handled entirely through **Supabase Auth** using **email/password** credentials. The flow produces a standard **JWT (JSON Web Token)** session.

```
User → Login Form (Login.tsx)
         │
         ▼
  supabase.auth.signInWithPassword({ email, password })
         │
         ▼
  Supabase Issues: Access Token (JWT) + Refresh Token
         │
         ▼
  Tokens stored in localStorage (managed by Supabase SDK)
         │
         ▼
  All subsequent supabase.from(...)  calls auto-attach JWT in Authorization header
```

### Authorization — Row Level Security (RLS)

Data access is enforced at the **database level** using **Supabase Row Level Security (RLS)** policies. The frontend enforces soft guards:

```typescript
// src/services/chatService.ts — all data calls first verify session
const { data: { session } } = await supabase.auth.getSession();
if (!session?.user) return []; // Early return if unauthenticated
```

The `user_id` is always included in data queries to enforce tenant isolation:

```typescript
.from('chats').select('*').eq('user_id', session.user.id)
```

### FastAPI Backend — Open CORS (Development)

The Python backend (`api.py`) currently uses **open CORS** (development mode):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ← Open during local development
    allow_methods=["*"],
    allow_headers=["*"],
)
```

> ⚠️ **Security Note:** The `/analyze` endpoint on FastAPI does **not** validate JWT tokens. This is a development-phase architectural gap. In production, the Supabase JWT should be forwarded from the frontend and verified on the FastAPI side (e.g., using `python-jose` or a shared Supabase secret).

### Auth Protocol Summary

| Layer | Method | Status |
|---|---|---|
| User Identity | Supabase Auth (JWT) | ✅ Implemented |
| Database Access | Supabase RLS + `user_id` scoping | ✅ Implemented |
| Session Persistence | Supabase SDK (localStorage) | ✅ Implemented |
| Password Recovery | `supabase.auth.resetPasswordForEmail()` | ✅ Implemented (`ForgotPassword.tsx`) |
| FastAPI Endpoint Auth | JWT validation on `/analyze` | ⚠️ Not yet implemented |
| API Key Protection | None (local dev) | ⚠️ Not applicable in current scope |

---

## 5. What is the central gateway or system that manages the flow of data from the backend AI/Mapping teams to the user interface?

The central gateway in Mini Carivix is the **`Home.tsx` component acting as the orchestration hub**, supported by a clearly structured service layer. There is no centralized API Gateway process — instead, the **React service layer** acts as the integration point.

### Data Flow Architecture (End-to-End)

```
┌─────────────────────────────────────────────────────────┐
│                   USER INTERFACE (React)                │
│                      Home.tsx                           │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │  Chat Sidebar│   │  Message Feed│   │ AI Viz     │  │
│  │ (previousChats│   │  (messages[])│   │ Component  │  │
│  └──────────────┘   └──────────────┘   └────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ handleSendMessage()
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌─────────────────┐          ┌──────────────────────┐
│  aiService.ts   │          │   chatService.ts      │
│  (AI Gateway)   │          │   (Data Gateway)      │
│                 │          │                       │
│  POST /analyze  │          │  supabase.from(...)   │
│  → FastAPI :8000│          │  → Supabase Cloud DB  │
└────────┬────────┘          └──────────┬────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────────┐   ┌─────────────────────┐
│  FastAPI Backend        │   │  Supabase (BaaS)    │
│  virtual_assistant/     │   │                     │
│  ├── api.py (router)    │   │  Tables:            │
│  ├── pipeline.py (ML)   │   │  - chats            │
│  ├── ner.py (NLP)       │   │  - messages         │
│  ├── rag_llm.py (LLM)   │   │  - login_history    │
│  └── models/ (artifacts)│   │  Auth: JWT sessions │
└─────────────────────────┘   └─────────────────────┘
```

### The Two Service Gateways

#### 1. `aiService.ts` — AI Data Gateway
- Sends the user query to `POST http://localhost:8000/analyze`.
- Receives `{ intent, entities, response, ai_analysis, chart_type }`.
- The `Home.tsx` orchestrator then transforms this raw payload into `chartData`, `chartType`, and `analysis` fields for rendering via `AIVisualization.tsx`.

#### 2. `chatService.ts` — Persistence & History Gateway
- Manages all Supabase interactions: creating chats, saving user messages, saving AI bot messages (with chart data), fetching history, and deleting sessions.
- Acts as the **source of truth** for all persistent UI state.
- All message fields including `chart_data`, `chart_type`, `chart_title`, and `analysis` are stored per-message in Supabase, making the chat fully restorable.

#### 3. `authService.ts` — Identity & GIS Gateway
- Wraps Supabase Auth APIs for signup, login, logout, session retrieval, and profile updates.
- **Captures geographic coordinates** (`lat`, `lng`) at login/signup time and stores them in both user metadata and the `login_history` table via `userService.recordLogin()`.

### Summary

> The **React service layer** (`aiService.ts`, `chatService.ts`, `authService.ts`) is the true central gateway of Mini Carivix — it decouples the UI from both the AI backend and the database, normalises all data before rendering, and provides a clean abstraction that allows either backend to evolve independently.

---

*Document created: 2026-02-24 | Project: Mini Carivix | By: Karthik Mahajan (Full Stack Developer)*
