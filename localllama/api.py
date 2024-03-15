from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import fitz
from io import BytesIO
import re
from langchain.chains import ConversationalRetrievalChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
# from langchain.llms import HuggingFacePipeline
from fastapi.responses import JSONResponse
# import base64
# import io
import requests
import os
import pickle
from loadllm import Loadllm
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI()

origins = ["*"]  # Set this to your frontend URL(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
os.environ["GRADIENT_ACCESS_TOKEN"] = "qmo0P8rEERRVzm0XoEIvm9j41aQEu5Z2"
os.environ["GRADIENT_WORKSPACE_ID"] = "fde7dc26-fb49-4ba9-9fc3-818e15c189ae_workspace"

chat_history = []

def open_pdf_from_url(pdf_url):
    try:
        # Download PDF content from the URL
        response = requests.get(pdf_url)
        response.raise_for_status()

        # Open the PDF using PyMuPDF
        pdf_document = fitz.open(stream=BytesIO(response.content))
        return pdf_document
    except Exception as e:
        print(f"Error: {e}")
def pdfTextExtractor(pdf_document):
    text = ""
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")
    text = re.sub(r"\n", " ", text)
    pdf_document.close()
    return text

template = """You are a financial expert with access to the annual report of the company.
When answering questions about the company's financial performance, prioritize information from the Financial Statements section.Considering the user's question, provide clear and concise answers from given context.
{context}

Question: {question}
Answer:
"""

embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

@app.get("/")
def read_root():
    return {"message": "Hello, this is your FastAPI server on Colab with pyngrok!"}


@app.post("/api/vectorizer")
async def upload_file(data: dict):
    store_name = data["id"]
    url = data["url"]
    pdf_document = open_pdf_from_url(url)
    text = pdfTextExtractor(pdf_document)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200, length_function=len
    )
    chunks = text_splitter.split_text(text=text)
    if os.path.exists(f"vectorestore/{store_name}.pkl"):
        return {"detail":"File already exists"}
    else:
        VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
        with open(f"vectorestore/{store_name}.pkl", "wb") as f:
            pickle.dump(VectorStore, f)
        return {"message": "File uploaded and stored"}


@app.post("/api/generate")
async def generate_response(data: dict):
    store_name = data["id"]
    with open(f"vectorestore/{store_name}.pkl", "rb") as f:
        VectorStore = pickle.load(f)
    
    llm = Loadllm.load_llm()
    
    chain = ConversationalRetrievalChain.from_llm(
        llm, VectorStore.as_retriever(), return_source_documents=True
    )
    query = data["message"]
    result = chain.invoke({"question": query, "chat_history": chat_history})
    return JSONResponse(content={"message": result["answer"]})




if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
