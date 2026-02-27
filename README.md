# AI-Powered Meeting Summary System  
## Entrata Technical Assignment

---

## 📌 Project Overview

This project is a full-stack AI-powered meeting summarization system.

It accepts raw meeting transcripts and generates structured summaries including:

- Main Topics
- Key Decisions
- Action Items (with owner and due date)

The system is designed with a clean separation of concerns between frontend, backend, and AI service layers.

---

# 🏗 System Architecture

## High-Level Architecture

Client (React Frontend)
        ↓
REST API (Node.js + Express Backend)
        ↓
AI Service Layer
        ↓
Ollama (LLaMA3 Local Model)

---

## 📁 Project Structure

Assessment/
├── meeting-summary-client # React frontend
├── meeting-summary-server # Node.js + Express backend
└── README.md


## 🔄 Request Flow

1. User enters meeting transcript in the React frontend.
2. Frontend sends POST request to:
3. Backend route receives the request.
4. Service layer constructs a structured prompt.
5. Backend calls Ollama’s local LLaMA3 model.
6. Model generates structured output.
7. Backend safely parses and validates JSON.
8. Structured response is returned to frontend.
9. Frontend renders summary sections cleanly.

---

# ⚙️ Technical Decisions

## 1️⃣ Backend Framework – Node.js + Express

Chosen because:

- Lightweight and efficient for REST APIs
- Minimal boilerplate
- Clear middleware-based architecture
- Easy integration with external AI services

The backend is structured using:

- Route layer (API endpoints)
- Service layer (AI interaction logic)
- Error handling middleware
- Safe JSON parsing utilities

This separation improves maintainability and scalability.

---

## 2️⃣ Service Layer Isolation

AI interaction logic is placed inside a dedicated service file.

Benefits:

- Clean separation of concerns
- Easier to swap AI models in the future
- Better testability
- Prevents AI logic from polluting route handlers

---

## 3️⃣ Safe JSON Handling Strategy

Large Language Models may return:

- Extra explanation text
- Markdown formatting
- Invalid JSON wrappers

To prevent runtime crashes:

- Implemented regex-based JSON extraction
- Added safe parsing with fallback
- Enforced structured prompt rules
- Added input validation for empty transcripts

This ensures API reliability even when model output is imperfect.

---

## 4️⃣ Prompt Engineering Approach

The prompt was designed with:

- Explicit anti-hallucination instructions
- Strict JSON output format
- Section-based conditional generation
- Clear extraction rules

This improves output consistency and reduces fabricated data.

---

# 🧠 AI Tool Selection & Reasoning

## Selected Tool: Ollama + LLaMA3

The system uses:

- Ollama (local model runner)
- LLaMA3 model

---

## Why Ollama?

Ollama was selected because:

- Runs fully locally
- No external API dependency
- No usage cost
- No rate limits
- Ensures data privacy
- Provides simple REST API interface
- Easy to integrate with Node.js via HTTP

This is ideal for handling potentially sensitive meeting data.

---

## Why LLaMA3?

LLaMA3 was chosen because:

- Strong instruction-following ability
- Good structured output performance
- Efficient local inference
- Suitable for summarization tasks

---

## Alternatives Considered

### OpenAI API
Pros:
- High accuracy
- Strong JSON adherence

Cons:
- Paid usage
- External dependency
- Requires internet
- API key security concerns

### Hosted HuggingFace Models
Pros:
- Easy access

Cons:
- Internet dependent
- Slower response
- Less control

For this assignment, a fully local AI pipeline provided better architectural control and privacy.

---

# 🔐 Reliability & Error Handling

The backend includes:

- Empty transcript validation
- Structured error responses
- Try/catch around AI service calls
- Safe JSON parsing
- Explicit logging for debugging

This ensures predictable API behavior.

---

# 🚀 How to Run Locally

## 1️⃣ Install Backend
cd meeting-summary-client
npm install


## 3️⃣ Start Ollama


ollama serve
ollama pull llama3


## 4️⃣ Start Backend


cd meeting-summary-server
npm run dev


Runs on:

http://localhost:5000


## 5️⃣ Start Frontend


cd meeting-summary-client
npm start


Runs on:

http://localhost:3000


---

# 📡 API Endpoint

### POST `/api/summary`

### Request Body:

```json
{
  "transcript": "Meeting transcript text...",
  "section": "all"
}
Response:
{
  "main_topics": [],
  "key_decisions": [],
  "action_items": []
}
📈 Future Improvements

Dockerize full stack application

Add streaming model responses

Add transcript upload (file support)

Store summaries in database

Add authentication layer

Deploy to cloud infrastructure

👨‍💻 Author

Krushna Sananse
Full Stack Developer
