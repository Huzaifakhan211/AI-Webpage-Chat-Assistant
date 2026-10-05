from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI

from dotenv import load_dotenv
import os


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# ==========================================
# Gemini LLM
# ==========================================

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    google_api_key=GOOGLE_API_KEY
)


# ==========================================
# Create FastAPI Application
# ==========================================

app = FastAPI()


# ==========================================
# Hugging Face Embeddings
# ==========================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ==========================================
# CORS - Allow Chrome Extension
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Data Models
# ==========================================

class WebpageData(BaseModel):
    text: str


class QuestionData(BaseModel):
    question: str


# ==========================================
# Home Route
# ==========================================

@app.get("/")
def home():

    return {
        "message": "AI Webpage Chat Assistant Backend is running"
    }


# ==========================================
# Receive and Store Webpage
# ==========================================

@app.post("/webpage")
def receive_webpage(data: WebpageData):

    # --------------------------------------
    # 1. Convert webpage text into Document
    # --------------------------------------

    document = Document(
        page_content=data.text
    )


    # --------------------------------------
    # 2. Split webpage into chunks
    # --------------------------------------

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = text_splitter.split_documents(
        [document]
    )


    # --------------------------------------
    # 3. Create / Load Chroma Database
    # --------------------------------------

    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )


    # --------------------------------------
    # 4. Store chunks in Chroma
    # --------------------------------------

    vector_store.add_documents(
        chunks
    )


    # --------------------------------------
    # 5. Print information
    # --------------------------------------

    print("Webpage received")
    print("Characters:", len(data.text))
    print("Chunks created:", len(chunks))


    # --------------------------------------
    # 6. Return response
    # --------------------------------------

    return {
        "message": "Webpage stored successfully",
        "characters": len(data.text),
        "chunks": len(chunks)
    }


# ==========================================
# Ask Question
# ==========================================

@app.post("/ask")
def ask_question(data: QuestionData):

    # --------------------------------------
    # 1. Load Chroma Database
    # --------------------------------------

    vector_store = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )


    # --------------------------------------
    # 2. Create Retriever
    # --------------------------------------

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 4
        }
    )


    # --------------------------------------
    # 3. Retrieve Relevant Chunks
    # --------------------------------------

    relevant_chunks = retriever.invoke(
        data.question
    )


    # --------------------------------------
    # 4. Combine Retrieved Chunks
    # --------------------------------------

    context = "\n\n".join(
        chunk.page_content
        for chunk in relevant_chunks
    )


    # --------------------------------------
    # 5. Create Prompt
    # --------------------------------------

    prompt = f"""
You are an AI assistant that answers questions about a webpage.

Use ONLY the information provided in the context below.

If the answer is not available in the context,
say exactly:

"I could not find the answer in the webpage."

Context:
{context}

Question:
{data.question}

Answer:
"""


    # --------------------------------------
    # 6. Send Prompt to Gemini
    # --------------------------------------

    response = llm.invoke(
        prompt
    )


    # --------------------------------------
    # 7. Get Gemini Answer
    # --------------------------------------

    answer = response.content

    # Gemini may return structured content
    # instead of a simple string.
    if isinstance(answer, list):

        text_parts = []

        for item in answer:

            if isinstance(item, dict):

                if item.get("type") == "text":

                    text_parts.append(
                        item.get("text", "")
                    )

            elif isinstance(item, str):

                text_parts.append(item)

        answer = "\n".join(text_parts)


    # --------------------------------------
    # 8. Return Answer
    # --------------------------------------

    return {
        "question": data.question,
        "answer": answer
    }