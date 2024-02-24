import React, { useState } from 'react';
import { IoSend } from "react-icons/io5";

const Chat = () => {
  const [currentMessage, setCurrentMessage] = useState(0);



  return (
    <div className="border border-gray-300 rounded-lg p-5 relative">
    <div className="chat-header flex justify-center mb-5">
      <h2>Tata Consultancy Services</h2>
    </div>
    <div className="flex-1 overflow-y-auto">

    </div>
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white p-4">
            <input type="text" id="chat" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ask Questions" required />
        <button className="flex cursor-pointer items-center justify-center rounded-r-md bg-accent-500 px-5 py-3 text-white">
          <IoSend />
        </button>
    </div>
  </div>     

  );
};

export default Chat;