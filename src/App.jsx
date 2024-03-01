import React, { useState, useEffect } from 'react';
import PDFViewer from './components/PDFViewer';
import Chat from './components/ChatApp';
import Sidebar from './components/SideBar';
import axios from "axios" 
const App = () => {
 
  
  const [selectedFile, setSelectedFile] = useState(null);
  // const [pdfFile, setPdfFile] = useState('annual-report-2022-2023.pdf');
  const apiUrl = `https://4d27-34-124-187-42.ngrok-free.app/`+"api/upload";
  
  const handlePdfChange = (file) => {
    setSelectedFile(file);
    console.log(file);
    const formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(response => {
        // Handle the successful response
        console.log(response.data)
        return response.data;
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.log(error);
      });

    };


  return (
    <main className="mx-auto grid h-[100vh] w-[100vw] md:grid-cols-[20%_40%_40%]">

      <Sidebar handlePdfChange={handlePdfChange} selectedFile={selectedFile}/>
      <PDFViewer pdfFile={selectedFile} />
      <Chat selectedFile={selectedFile}/>
    </main>
  );
};

export default App;