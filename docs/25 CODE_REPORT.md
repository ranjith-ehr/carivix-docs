# Code Report – Mini Carivix

## 1. Purpose

This document provides a structured overview of the Mini Carivix codebase.  
It explains how the source code is organized, how responsibilities are distributed across modules, and where each major system capability is implemented.

This report is intentionally descriptive and does not include implementation-level code.

---

## 2. Repository Organization Overview

The Mini Carivix repository follows a modular, responsibility-driven structure.  
Each major functional role in the system has a dedicated directory.

![Repository Folder Structure Overview](https://i.postimg.cc/D0XN6Bmk/Repository-Folder-Structure-Overview.png)

### Top-Level Structure

- `backend/` – API services, NLP pipeline, ML serving
- `frontend/` – Client-side application
- `data-analyst/` – Exploratory analysis and visualizations
- `data-scientist/` – Model training and evaluation
- `data/` – Raw and processed datasets
- `docs/` – System documentation
- `reports/` – Supporting reports and PDFs

---

## 3. Backend Codebase

### Location
backend/


### Responsibility
The backend is the orchestration engine of the Mini Carivix platform.  
It handles all server-side processing and exposes REST endpoints consumed by the frontend.

### Key Submodules

#### NLP Pipeline

backend/nlp/

This directory contains the Natural Language Processing pipeline responsible for:

- Speech-to-text handling
- Intent classification
- Entity extraction
- Query routing
- Structured context generation
- Response formatting

Modules in this directory collectively implement the NLP flow described in `NLP_PIPELINE.md`.

![NLP DATAFLOW PROCESS](https://i.postimg.cc/g0Cr57jJ/NLP-PIPELINE.png)

---

#### Machine Learning Models
backend/models/


This directory contains serialized machine learning models used for inference and forecasting.  
Models are loaded during backend initialization and are not retrained at runtime.

---

#### Artifacts and Outputs
backend/nlp/artifacts/
backend/nlp/forecasting/
backend/nlp/insights/
backend/nlp/visualization/


These directories store:
- Prediction outputs
- Aggregated insights
- Visualization-ready data
- Supporting inference artifacts

---

## 4. Frontend Codebase

### Location
frontend/


### Responsibility
The frontend is a Single Page Application (SPA) responsible for:

- User authentication
- Query submission
- Rendering responses
- Displaying visual insights
- Managing UI state and session continuity

### Structure Summary

- `src/` – UI components and service logic
- `public/` – Static assets
- `virtual_assistant/` – UI-level assistant integration
- Configuration files for build, styling, and environment setup

The frontend communicates exclusively with the backend REST API and does not perform any analytics or computation.


![Frontend Component Interaction Flow](https://i.postimg.cc/SsjF6Qk5/Frontend-Component-Interaction-Flow.png)

---

## 5. Data Science Codebase

### Location
data-scientist/


### Responsibility
This directory contains the machine learning research and training pipeline.

### Key Areas

- `training/` – Model training and forecasting logic
- `evaluation/` – Performance validation and metrics
- `models/` – Trained model definitions
- `artifacts/` – Serialized models and outputs
- `notebooks/` – Experimental and exploratory work

This codebase is responsible for generating the final models used by the backend serving layer.

![Data Science Training Pipeline](https://i.postimg.cc/Dy1ZJ6Cy/Data-Science-Training-Pipeline.png)

---

## 6. Data Analyst Codebase

### Location
data-analyst/


### Responsibility
The data analyst module focuses on exploratory data analysis and KPI validation.

### Contents

- Jupyter notebooks for:
  - Trend analysis
  - KPI evaluation
  - Comparative analysis
- Visualization generation
- Analytical reporting support

A strict **Zero-Mutation Policy** is enforced.  
Datasets are analyzed but never modified at this stage.

![Data Analysis Workflow](https://i.postimg.cc/9XtKDqGs/Data-Analysis-Workflow.png)

---

## 7. Data Assets

### Location
data/
├── raw/
└── processed/


### Description

- `raw/` contains original, unmodified datasets
- `processed/` contains cleaned and transformed datasets used downstream

These datasets are consumed by:
- Data Analyst workflows
- Data Science training pipelines
- Backend analytics modules

---

## 8. Reports and Supporting Files

### Location

reports/

This directory contains:
- PDF reports
- Submission documents
- Supporting project materials

These files complement the markdown documentation but do not replace it.

---

## 9. Design Principles Reflected in Code

The codebase adheres to the following principles:

- Clear separation of concerns
- Deterministic computation
- Modular responsibility boundaries
- Documentation-first alignment
- Production-oriented organization

---

## 10. Relationship to Documentation

Each code module is directly referenced by system documentation:

- Backend logic → `BACKEND_OVERVIEW.md`
- NLP implementation → `NLP_PIPELINE.md`
- ML workflows → `DATA_SCIENCE_PIPELINE.md`
- Frontend behavior → `FRONTEND_OVERVIEW.md`
- End-to-end flow → `SYSTEM_ARCHITECTURE.md`

This ensures full traceability between documentation and implementation.

---

## 11. Conclusion

The Mini Carivix codebase is structured to support clarity, scalability, and maintainability.  
By separating concerns across well-defined directories and aligning documentation with implementation, the project maintains both academic rigor and production readiness.