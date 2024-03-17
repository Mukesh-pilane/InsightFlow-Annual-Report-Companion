import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";
import { db, storage } from '../firebase/firebase.init';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext'
import { useLocation } from 'react-router-dom';
import { vectorizer } from '../utility/llmApi';
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PDFviewer = ({ pageNumber, handlePageNumber }) => {
  const [numPages, setNumPages] = useState();
  const { chats } = useChat()
  const location = useLocation();
  const { user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);

  const getPdfUrl = () => {
    if (chats.length == 0) {
      return
    }
    const currentChat = chats.filter((chat) => {
      return chat.chatId == location.pathname.split("/")[2]
    })

    const storageRef = ref(storage, `uploads/${user.uid}/${currentChat[0].chatId}/${currentChat[0].chatName}`);

    // Fetch the download URL
    getDownloadURL(storageRef)
      .then(async (downloadURL) => {
        vectorizer(downloadURL, currentChat[0].chatId)
        setPdfUrl(downloadURL)
      })
      .catch((error) => {
        console.error('Error getting download URL:', error.message);
      });
  }
  useEffect(() => {
    getPdfUrl()
    handlePageNumber(1)
  }, [user, location, chats])

  const file = useMemo(() => {
    if (!pdfUrl) {
      return null;
    }

    return {
      url: pdfUrl,
    };
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };



  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };
  return (

    <div className='h-[100vh] p-4 flex flex-col items-center overflow-y-auto'>
      {
        pdfUrl && (
          <>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="h-[100vh] space-x-2 text-white p-2 rounded-lg flex items-center">
                  <div className='h-3 w-3 bg-accent-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                  <div className='h-3 w-3 bg-accent-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                  <div className='h-3 w-3 bg-accent-500 rounded-full animate-bounce'></div>
                </div>
              }
              className="space-y-2"
            >

              {/* {Array.from({ length: numPages }, (_, index) => ( */}
              <div
                // key={`page_${index + 1}`} 
                className='shadow-lg w-full'>
                {/* <Page
                    // className="w-[70%]" // Responsive width classes
                    loading={
                      <div class="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                    }
                    key={`page_${index + 1}`} pageNumber={index + 1}
                    // height={500}
                    width={470}
                  /> */}
                {/* ))} */}

                <Page
                  width={400}
                  loading=""
                  pageNumber={pageNumber}
                />
              </div>
            </Document>

            {/* <div className='flex justify-center w-[50px] mx-auto gap-3'>
              <button
                className=" relative mr-auto  w-fit rounded-full bg-dark-500 p-2 py-1 text-white shadow-2xl shadow-dark-500/50"
                onClick={goToPreviousPage} disabled={pageNumber === 1}>
                Prev
              </button>
              <button
                className=" relative ml-auto  w-fit rounded-full bg-dark-500 p-2 py-1 text-white shadow-2xl shadow-dark-500/50"

                onClick={goToNextPage} disabled={pageNumber === numPages}>
                Next
              </button>
            </div> */}
          </>
        )
      }

    </div>
  );
};

export default PDFviewer;