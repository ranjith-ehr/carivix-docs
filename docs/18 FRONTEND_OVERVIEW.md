# Frontend Overview – Mini Carivix

## 1. Purpose

This document describes the design, responsibilities, and behavior of the Mini Carivix frontend application.

The frontend provides the primary user interface for submitting queries and viewing insights.

---

## 2. Frontend Responsibilities

The frontend is responsible for:

- User authentication
- Query input handling
- API communication
- Rendering textual and visual responses
- Managing session continuity
- Providing a responsive user experience

---

## 3. Application Structure

Key design principles:
- Minimal routing complexity
- Component-driven architecture
- Clear separation between UI and service logic

![Frontend Component Structure](https://i.postimg.cc/xCZDyJsY/Frontend-Component-Structure.png)

---

## 4. Authentication Flow

1. User registers or logs in.
2. Authentication service issues a secure session token.
3. Token is stored securely on the client.
4. Token is attached to authorized requests.

Authentication status determines access to platform features.

---

## 5. Query Interaction Flow

1. User enters a query.
2. Input is validated at the UI level.
3. Query is dispatched to the backend API.
4. UI enters a loading or pending state.
5. Results are rendered once received.

![Frontend Query Interaction Flow](https://i.postimg.cc/CLSTCg7M/Frontend-Query-Interaction-Flow.png)

---

## 6. Visualization Rendering

Visualizations are rendered based on metadata returned by the backend.

The frontend:
- Does not compute analytics
- Does not alter data values
- Renders charts strictly as instructed by backend responses

---

## 7. User Experience Considerations

- Optimistic UI behavior
- Clear loading indicators
- Graceful handling of slow responses
- Responsive layout across screen sizes

---

## 8. Related Documentation

- User Guide → `USER_GUIDE.md`
- Full Stack Architecture → `FULL_STACK_ARCHITECTURE.md`
- API Reference → `API_REFERENCE.md`