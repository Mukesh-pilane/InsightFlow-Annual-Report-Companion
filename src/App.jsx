import React, { useState, useEffect } from 'react';
import PDFViewer from './components/PDFViewer';
import Chat from './components/ChatApp';
import Sidebar from './components/SideBar';
import axios from "axios" 
const App = () => {
 
  
  const [selectedFile, setSelectedFile] = useState(null);
  // const [pdfFile, setPdfFile] = useState('annual-report-2022-2023.pdf');
  const apiUrl = `https://356e-104-155-167-216.ngrok-free.app/api/upload`;
  
  const handlePdfChange = (file) => {
    setSelectedFile(file);
    console.log(file);
    const formData = new FormData();
      formData.append('file', file);
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

  //    useEffect(() => {
  //    const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://356e-104-155-167-216.ngrok-free.app/');
        
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const result = await response.json();
  //       console.log(response);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //     } 
  //   };
  //   fetchData()
  // },[])

  const [data, setData] = useState(null);

  useEffect(() => {
    // Define a function to make the GET request
    const fetchData = async () => {
      axios.get("https://dca8-35-194-235-101.ngrok-free.app")
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

    // Call the fetchData function
    fetchData();

    // If you need to clean up, return a function from useEffect
    return () => {
      // Any cleanup code goes here
    };

    // Add any dependencies to the dependency array if needed
  }, []); // An empty dependency array means this effect will run once on mount



  return (
    <main className=" mx-auto grid h-full w-[100vw] md:grid-cols-[20%_40%_40%]">

      <Sidebar handlePdfChange={handlePdfChange} selectedFile={selectedFile}/>
      <PDFViewer pdfFile={selectedFile} />
      <Chat/>
    </main>
  );
};

export default App;