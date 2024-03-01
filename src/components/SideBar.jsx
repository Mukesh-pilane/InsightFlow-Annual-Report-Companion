import React, {useState} from 'react';
import PdfUpload from './PdfUpload';

const Sidebar = ({handlePdfChange, selectedFile}) => {


  
  return (
    <div className="bg-gray-800 text-white p-5">
      <PdfUpload onPdfChange={handlePdfChange} seleltedFile={selectedFile}/>
 
      <ul>
        <li className="m-2">
          <a
            href="annual-report-2022-2023.pdf"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {selectedFile?.name}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;