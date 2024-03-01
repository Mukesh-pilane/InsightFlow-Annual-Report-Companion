import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdfjsLib from 'pdfjs-dist';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfFile }) => {

  return (

      <div className='h-[100vh] overflow-scroll'>
        {
          pdfFile && (
          <Document className='w-full' file={URL.createObjectURL(pdfFile)}>
                  <Page pageNumber={1} />
          </Document>
          )
        }
     
      </div>
  );
};

export default PDFViewer;