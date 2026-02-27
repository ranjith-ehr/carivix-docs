# CARIVIX Voice Analytics Assistant

A voice and text–based business analytics assistant that converts natural language queries into structured intent and entities, performs data-driven analysis, and generates human-like responses with insights and actionable suggestions.

---

## 📌 Project Overview

CARIVIX AI Analytics Assistant enables users to interact with structured business data using natural language (voice or text).

The system:

Classifies user intent using a trained ML model

Extracts dynamic entities (product, category, region, quarter, year, metric)

Performs structured data aggregation on business datasets

Produces human-like explanations using LLM (Groq – LLaMA 3.1)

This project combines deterministic analytics with generative AI to ensure both accuracy and natural interaction.

---

## 🎯 Objectives

- Convert voice/text queries into intent + entities  
- Extract time, region, and metric using spaCy NER  
- Perform analytics on structured business datasets  
- Generate natural language responses with:
  - Answer
  - Analysis
  - Suggestions  

---

## 🧠 System Architecture

Voice/Text Input
→ ASR (Speech-to-Text)
→ Intent Classification (Trained Model)
→ Dynamic NER (Product, Category, Region, Time, Metric)
→ Structured Filtering & Aggregation (CSV Dataset)
→ LLM Response Generation (Groq – LLaMA 3.1)
→ Text / Voice Output 

---

## 🧩 Features

- Voice and text input support  
- Lightweight intent classification  
- spaCy-based Named Entity Recognition  
- Time-based and region-wise analytics  
- Monthly and quarterly sales analysis  
- Best-performing region identification  
- Human-like responses with analysis and suggestions  

---

## 📂 Project Structure

Virtual_assistant/
├── pipeline.py
├── asr.py
├── ner.py
├── intent_classifier.py
├── artifacts/
│   └── intent_classifier.pkl
├── rag_llm.py
├── tts.py
├── business_dataset_cleaned_1500_rows1.csv
└── README.md

---

## 🗣️ Example Queries & Outputs

### Query
Show me sales in south region last month

### Assistant Output
Sales in the South region last month were ₹940,730 with 755 units sold.

Analysis:  
The South region maintained stable demand and consistent performance.

Suggestion:  
Targeted promotions and retention strategies can further increase sales.

---

### Query
Which region performed best last quarter?

### Assistant Output
The South region performed best in the last quarter with the highest total sales.

Analysis:  
Strong customer demand and effective regional execution drove better performance.

Suggestion:  
Replicate South region strategies in other regions to improve overall performance.

---

## 🛠️ Technologies Used

Python

Pandas

scikit-learn

spaCy

Matplotlib

Groq API (LLaMA 3.1)

SpeechRecognition

Text-to-Speech 

---

## 🚀 How to Run

1. Install dependencies  
pip install -r requirements.txt  
python -m spacy download en_core_web_sm  

2. Run the assistant  
python pipeline.py  

---

## 🚀 ACCURACY

Example pipeline evaluation:

Intent Accuracy: 0.80
Data Retrieval Success Rate: 1.00
Overall System Score: 0.90