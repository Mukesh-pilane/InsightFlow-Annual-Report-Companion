import React, {useState} from 'react';
import PdfUpload from './PdfUpload';

const Sidebar = ({handlePdfChange, selectedFile}) => {


  
  return (
    <div className="bg-gray-800 text-white p-5">
      <PdfUpload onPdfChange={handlePdfChange} seleltedFile={selectedFile}/>
 
      <ul>
        <li className="mb-2">
          <a
            href="annual-report-2022-2023.pdf"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            annual-report-2022-2023.pdf
          </a>
        </li>
        <li className="mb-2">
          <a
            href="div-class-title-evaluating-word-em.html"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            div-class-title-evaluating-word-em.html
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;