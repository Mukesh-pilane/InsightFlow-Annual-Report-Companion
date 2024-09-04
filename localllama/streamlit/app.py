import streamlit as st
from dotenv import load_dotenv
import re
import fitz
import time
from langchain_core.documents import Document
from streamlit_extras.add_vertical_space import add_vertical_space
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain.retrievers.document_compressors import FlashrankRerank
from langchain.retrievers import ContextualCompressionRetriever
from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Define the prompt template
template = """You are a financial expert with access to the annual report of the company.
When answering questions about the company's financial performance, prioritize information from the Financial Statements section.Considering the user's question, provide clear and concise answers from given context.
{context}

Question: {question}
Answer:
"""
prompt = ChatPromptTemplate.from_template(template)


IntroTemplate = """Based on this data:
{info}
on the basis of the following report give Overview of the annual report in short
overview:
"""

IntroPrompt = PromptTemplate.from_template(IntroTemplate)
load_dotenv()


def intro(VectorStore):
    keyword = ["About","Financial Performance", "Letter of Ceo","Management Discussion"]
    output=[]
    for keyword in keyword:
        doc = VectorStore.similarity_search(keyword, k=1)
        output.append(doc[0].page_content)
    return f"""{output[0]}\n
{output[1]}\n
{output[2]}\n
{output[3]}\n
"""


def main():
    # st.header("Chat with PDF")
    # embeddings = HuggingFaceEmbeddings(model_name="../all-MiniLM-L6-v2")
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")

    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3,stream=True)
    # Upload a PDF file
    pdf = st.file_uploader("Upload your PDF", type='pdf')
    hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            </style>
            """
    st.markdown(hide_streamlit_style, unsafe_allow_html=True) 

    if pdf is not None:
        # Use Streamlit's session state to store the vector store and chat history
        if "vector_store" not in st.session_state:
            with st.spinner("Processing your PDF and creating the vector store..."):
                start_time = time.time()
                # Read and process the PDF
                doc = fitz.open(stream=pdf.read(), filetype="pdf")
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=2000,
                    chunk_overlap=200,
                    length_function=len
                )
                pages = []
                for page_no in range(doc.page_count):
                    text = doc[page_no].get_text()
                    text = re.sub(r"\n", " ", text)
                    text = text_splitter.split_text(text=text)
                    for chunk in text:
                        page = Document(page_content=chunk, metadata={"page": page_no + 1})
                        pages.append(page)

                # Create the FAISS vector store and store it in session state
                VectorStore = FAISS.from_documents(pages, embedding=embeddings)
                st.session_state.vector_store = VectorStore
                end_time = time.time()
                processing_time = end_time - start_time
                st.success(f"Vector store created successfully! {processing_time}")
            
                    # Initialize chat history
            if "messages" not in st.session_state:
                st.session_state.messages = []

            # Initialize chat history
            if "chat_history" not in st.session_state:
                st.session_state.chat_history = []
                
            info = intro(VectorStore)
            llmforIntro = LLMChain(prompt=IntroPrompt, llm=llm)
            introduction = llmforIntro.run(info=info)
            st.session_state.messages.append({"role": "assistant", "content":introduction})    


        retriever = st.session_state.vector_store.as_retriever(search_kwargs={"k": 10})

        Fcompressor = FlashrankRerank(top_n=4)
        Flash_compression_retriever = ContextualCompressionRetriever(
            base_compressor=Fcompressor, base_retriever=retriever
        )

        chain = ConversationalRetrievalChain.from_llm(
            llm, Flash_compression_retriever, return_source_documents=True,
            combine_docs_chain_kwargs={"prompt": prompt}
        )
        

        # Display chat messages from history on app rerun
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        if query:=st.chat_input("Ask questions about your PDF file:"):
            st.session_state.messages.append({"role": "user", "content": query})
            with st.chat_message("user"):
                st.markdown(query)
            with st.chat_message("assistant"):
                stream = chain.invoke({"question": query, "chat_history": st.session_state.chat_history})
                response = st.write(stream["answer"])
                st.session_state.messages.append({"role": "assistant", "content": stream["answer"]})    
if __name__ == '__main__':
    main()