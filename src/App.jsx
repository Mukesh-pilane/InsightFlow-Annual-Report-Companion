import React from 'react';
import Chat from './components/Chat';
import Sidebar from './components/SideBar';
import Layout from './components/Layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

const NotFound = () => {
  return (
    <div>
      Not Found
    </div>
  )
}

const App = () => {




  return (
    <>
      <Layout>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;