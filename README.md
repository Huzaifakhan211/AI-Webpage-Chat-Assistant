Yes. Since you upgraded the frontend from a basic button to a **professional chat-based Chrome extension**, your README should be updated to reflect the new UI and functionality.

Below is the **complete updated `README.md`** you can replace your current README with.

````markdown
# AI-Powered Webpage Chat Assistant Using LangChain and RAG

An AI-powered Chrome extension that allows users to read and chat with the content of the currently opened webpage.

The system uses **LangChain, Retrieval-Augmented Generation (RAG), Hugging Face embeddings, ChromaDB, FastAPI, and Gemini** to retrieve relevant information from a webpage and generate context-aware answers.

---

## Project Overview

The AI Webpage Chat Assistant works as a Chrome extension connected to a Python FastAPI backend.

The user opens a webpage, clicks the extension, and reads the webpage content. The content is then processed, split into smaller chunks, converted into vector embeddings, and stored in ChromaDB.

When the user asks a question, the system retrieves the most relevant webpage chunks and sends them as context to the Gemini language model.

The final answer is displayed directly inside the Chrome extension chat interface.

---

## Key Features

- Read content from the current webpage
- Extract webpage text directly from the browser
- Process webpage content using LangChain
- Split large webpages into smaller chunks
- Generate semantic embeddings using Hugging Face
- Store webpage embeddings in ChromaDB
- Retrieve relevant webpage information
- Generate answers using Gemini
- Chat with webpage content through a Chrome extension
- Professional chat-based frontend
- User and AI message interface
- Loading indicator while the AI generates an answer
- Suggested questions for users
- Clear chat functionality
- Current webpage status indicator
- FastAPI backend
- Interactive FastAPI API documentation

---

# System Architecture

```text
                    Chrome Browser
                         |
                         v
              +----------------------+
              |   Chrome Extension   |
              |                      |
              |  popup.html          |
              |  popup.css           |
              |  popup.js            |
              +----------+-----------+
                         |
                         | Webpage Text
                         v
              +----------------------+
              |     FastAPI          |
              |      Backend         |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | LangChain Document   |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | Recursive Character  |
              | Text Splitter        |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | Hugging Face         |
              | Embeddings           |
              +----------+-----------+
                         |
                         v
              +----------------------+
              |      ChromaDB        |
              |   Vector Database    |
              +----------+-----------+
                         |
                         | Relevant Chunks
                         v
              +----------------------+
              |      Retriever       |
              +----------+-----------+
                         |
                         v
              +----------------------+
              |    Gemini LLM        |
              +----------+-----------+
                         |
                         | AI Answer
                         v
              +----------------------+
              | Chrome Chat Interface|
              +----------------------+
````

---

# RAG Pipeline

The project follows a Retrieval-Augmented Generation pipeline.

```text
Webpage
   |
   v
Extract Text
   |
   v
LangChain Document
   |
   v
Text Splitting
   |
   v
Embeddings
   |
   v
ChromaDB
   |
   v
Retriever
   |
   v
Relevant Context
   |
   v
Gemini
   |
   v
AI Answer
```

---

# How the System Works

## 1. User Opens a Webpage

The user opens any supported webpage in Google Chrome.

For example:

```text
https://www.media-university.de/
```

---

## 2. Chrome Extension Reads the Webpage

The user opens the Chrome extension and clicks:

```text
Read Page
```

The extension extracts the visible webpage text using JavaScript.

```javascript
document.body.innerText
```

The extracted text is sent to the FastAPI backend.

---

## 3. FastAPI Receives the Webpage

The backend receives the webpage content through:

```text
POST /webpage
```

The text is converted into a LangChain `Document`.

```text
Webpage Text
     |
     v
LangChain Document
```

---

## 4. Text Splitting

Large webpage content is divided into smaller chunks using:

```text
RecursiveCharacterTextSplitter
```

Current configuration:

```text
Chunk Size: 1000
Chunk Overlap: 200
```

The overlap helps preserve context between neighboring chunks.

---

## 5. Generate Embeddings

Each chunk is converted into a numerical vector using:

```text
sentence-transformers/all-MiniLM-L6-v2
```

These vectors represent the semantic meaning of the webpage content.

---

## 6. Store Embeddings in ChromaDB

The embeddings and their corresponding text chunks are stored in:

```text
ChromaDB
```

The database is currently stored locally inside:

```text
backend/chroma_db/
```

---

## 7. User Asks a Question

The user can ask a question from the extension.

For example:

```text
What is this university about?
```

The question is sent to:

```text
POST /ask
```

---

## 8. Retriever Searches for Relevant Information

The retriever searches ChromaDB and returns the most relevant webpage chunks.

Current configuration:

```text
Top K = 4
```

This means the system retrieves the four most relevant chunks.

---

## 9. Gemini Generates the Answer

The retrieved chunks are added to the prompt as context.

Gemini then generates an answer based only on the retrieved webpage information.

If the information is not available, the system is instructed to respond:

```text
I could not find the answer in the webpage.
```

---

## 10. Answer is Displayed in the Extension

The generated answer is returned from FastAPI and displayed inside the Chrome extension's chat interface.

---

# Frontend

The Chrome extension has been upgraded from a basic test interface to a professional chat-based interface.

## Frontend Components

### Header

Displays:

```text
Webpage AI
Chat with this webpage
```

and includes a clear-chat button.

### Current Webpage Section

Displays the current webpage and its loading/ready status.

Example:

```text
CURRENT WEBPAGE
University Website

[ Page Ready ]
```

### Chat Interface

The interface displays separate messages for:

```text
User
AI
```

Example:

```text
User:
What is this page about?

AI:
The webpage provides information about...
```

### Suggested Questions

The interface provides predefined questions such as:

```text
Summarize this page
What is this page about?
What are the main points?
```

### Loading Indicator

While Gemini is generating a response, the interface displays:

```text
AI is thinking...
```

### Chat Input

Users can enter their own questions:

```text
Ask something about this webpage...
```

### Clear Chat

Users can clear the current conversation using the clear-chat button.

---

# Project Structure

```text
AI-Webpage-Chat-Assistant/
│
├── chrome-extension/
│   │
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── backend/
│   │
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   │
│   └── chroma_db/
│       └── ChromaDB files
│
├── .gitignore
│
└── README.md
```

---

# Technologies Used

| Technology                     | Purpose                              |
| ------------------------------ | ------------------------------------ |
| Python                         | Backend development                  |
| FastAPI                        | Backend API                          |
| LangChain                      | RAG pipeline and document processing |
| LangChain Document             | Webpage document representation      |
| RecursiveCharacterTextSplitter | Text chunking                        |
| Hugging Face                   | Text embeddings                      |
| Sentence Transformers          | Embedding model                      |
| ChromaDB                       | Vector database                      |
| Gemini                         | Large Language Model                 |
| JavaScript                     | Chrome extension logic               |
| HTML                           | Frontend structure                   |
| CSS                            | Frontend styling                     |
| Google Chrome Extension API    | Browser integration                  |

---

# AI and RAG Components

## LangChain Document

The webpage text is converted into a LangChain `Document`.

It contains:

```text
page_content
metadata
```

Example metadata:

```text
source = current_webpage
```

---

## RecursiveCharacterTextSplitter

Used to divide large webpage content into smaller chunks.

Configuration:

```text
chunk_size = 1000
chunk_overlap = 200
```

---

## Embedding Model

The project uses:

```text
sentence-transformers/all-MiniLM-L6-v2
```

The model converts text into numerical vectors that can be compared based on semantic similarity.

---

## ChromaDB

ChromaDB is used as the local vector database.

It stores:

```text
Text Chunks
+
Embeddings
+
Metadata
```

---

## Retriever

The retriever searches ChromaDB for information relevant to the user's question.

Current configuration:

```text
k = 4
```

Therefore, the system retrieves four relevant chunks.

---

## Gemini

Gemini is used as the final language model.

It receives:

```text
Question
+
Retrieved Context
```

and generates the final answer.

---

# Backend API

The FastAPI backend currently provides the following endpoints.

## GET /

Checks whether the backend is running.

```text
GET /
```

Example response:

```json
{
    "message": "AI Webpage Chat Assistant Backend is running"
}
```

---

## POST /webpage

Receives webpage content and processes it.

```text
POST /webpage
```

Example request:

```json
{
    "text": "Webpage content..."
}
```

The backend then:

```text
Receive Text
     |
     v
LangChain Document
     |
     v
Text Splitter
     |
     v
Embeddings
     |
     v
ChromaDB
```

---

## POST /ask

Receives the user's question.

```text
POST /ask
```

Example request:

```json
{
    "question": "What is artificial intelligence?"
}
```

Example response:

```json
{
    "question": "What is artificial intelligence?",
    "answer": "Artificial intelligence is..."
}
```

---

# Installation

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd AI-Webpage-Chat-Assistant
```

---

# Backend Setup

Go to the backend directory:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# Gemini API Key

Create a `.env` file inside:

```text
backend/
```

Add:

```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

Do not upload your API key to GitHub.

---

# Run the Backend

From the backend directory:

```powershell
python -m uvicorn main:app --reload
```

The backend should run at:

```text
http://127.0.0.1:8000
```

---

# FastAPI Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

FastAPI provides an interactive interface where you can test:

```text
GET /
POST /webpage
POST /ask
```

---

# Chrome Extension Setup

Open Google Chrome and navigate to:

```text
chrome://extensions/
```

Enable:

```text
Developer mode
```

Click:

```text
Load unpacked
```

Select:

```text
chrome-extension/
```

The extension will then appear in your Chrome extensions list.

---

# How to Use

## Step 1

Start the backend:

```powershell
python -m uvicorn main:app --reload
```

## Step 2

Open a webpage in Chrome.

Example:

```text
https://www.media-university.de/
```

## Step 3

Open the Webpage AI Chrome extension.

## Step 4

Click:

```text
Read Page
```

The extension extracts the webpage content and sends it to the backend.

## Step 5

Wait until the status changes to:

```text
Page Ready
```

## Step 6

Ask a question.

For example:

```text
What is this website about?
```

## Step 7

The question is sent to the RAG pipeline.

```text
Question
   |
   v
Retriever
   |
   v
ChromaDB
   |
   v
Relevant Chunks
   |
   v
Gemini
   |
   v
Answer
```

The answer is then displayed in the chat interface.

---

# Example

### User Question

```text
What is this university about?
```

### RAG Process

```text
Question
   |
   v
Embedding Search
   |
   v
ChromaDB
   |
   v
Top 4 Relevant Chunks
   |
   v
Gemini
```

### Final Answer

```text
The university provides programs and educational
opportunities in the fields described on the webpage.
```

---

# Security

The Gemini API key is stored in:

```text
.env
```

The `.env` file should not be committed to GitHub.

The project uses the following `.gitignore`:

```gitignore
.env
venv/
__pycache__/
*.pyc
chroma_db/
```

---

# Current Limitations

The current version is a working prototype and has some limitations.

### 1. Webpage Isolation

Currently, the project uses a single local ChromaDB directory.

If multiple webpages are processed, their data can be stored in the same vector database.

A future version should create separate collections or sessions for each webpage.

### 2. Conversation History

The current system does not yet maintain complete conversation history.

Each question is processed independently.

### 3. Webpage Extraction

The extension currently extracts:

```javascript
document.body.innerText
```

Some dynamically generated or restricted webpages may not provide complete content.

### 4. Local Backend

The backend currently runs locally:

```text
127.0.0.1:8000
```

It has not yet been deployed to a cloud server.

---

# Future Improvements

Planned improvements include:

* Separate vector database/session for each webpage
* Conversation history
* Multi-turn conversations
* Streaming AI responses
* Improved webpage extraction
* Better handling of dynamic webpages
* Session management
* User authentication
* API security
* Cloud deployment
* Responsive frontend
* Markdown rendering for AI responses
* Code block support
* Source/reference display
* RAG evaluation
* Retrieval quality evaluation
* PDF and document support
* Improved error handling
* Production deployment

---

# Project Learning Outcomes

This project provides practical experience with:

* Retrieval-Augmented Generation
* LangChain
* Large Language Models
* Prompt engineering
* Text chunking
* Semantic search
* Vector embeddings
* Vector databases
* ChromaDB
* Hugging Face models
* Gemini API
* FastAPI
* REST APIs
* Chrome Extension development
* Frontend and backend integration
* AI application development

---

# Project Status

| Component                     | Status      |
| ----------------------------- | ----------- |
| Chrome Extension              | Completed   |
| Professional Chat UI          | Completed   |
| Webpage Extraction            | Completed   |
| FastAPI Backend               | Completed   |
| LangChain Document Processing | Completed   |
| Text Splitting                | Completed   |
| Hugging Face Embeddings       | Completed   |
| ChromaDB Integration          | Completed   |
| Retriever                     | Completed   |
| Gemini Integration            | Completed   |
| Basic RAG Pipeline            | Completed   |
| Webpage Chat                  | Completed   |
| Multi-Webpage Isolation       | In Progress |
| Conversation History          | Planned     |
| Streaming Responses           | Planned     |
| Cloud Deployment              | Planned     |
| Authentication                | Planned     |

---

# Author

**Muhammad Huzaifa**

BS Computer Science (Artificial Intelligence)

---

# Project Goal

The main goal of this project is to build an AI-powered browser assistant that allows users to interact with webpage content using natural language.

Instead of manually searching through a long webpage, the user can simply ask a question and receive an answer based on the webpage's content.

The project combines:

```text
Chrome Extension
+
FastAPI
+
LangChain
+
RAG
+
Hugging Face Embeddings
+
ChromaDB
+
Gemini
```

to create an end-to-end AI-powered webpage question-answering system.

````

### Important update

Your README now reflects the new frontend:

```text
Before:
Read Webpage → Basic status text

Now:
Read Webpage
     ↓
Page Ready
     ↓
Professional Chat UI
     ↓
Suggested Questions
     ↓
User Question
     ↓
AI Response
     ↓
Chat History
````

