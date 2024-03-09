import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase.init";
import { addDoc, collection, serverTimestamp, doc, query, orderBy,onSnapshot } from "firebase/firestore";
const MessageArea = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      return
    }
    const userRef = doc(db, 'users', user.uid);
    const userChatsRef = doc(userRef, 'chats', location.pathname.split("/")[2]);
    const chatMessagesRef = collection(userChatsRef, 'messages')
    // Create a query for all messages
    const allMessagesQuery = query(
      chatMessagesRef,
      orderBy('timestamp')
    );

    // Subscribe to the query and update messages on snapshot changes
    const unsubscribe = onSnapshot(allMessagesQuery, (snapshot) => {
      const newAllMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newAllMessages);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, [user, location]);

  useEffect(() => {
    const messageArea = document.getElementById("message-area");

    // Scroll to the bottom of the message area
    messageArea.scrollTop = messageArea.scrollHeight;
  }, [messages]);



  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const sendMessageToServer = async () => {
    setLoading(true);
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: userInput },
      ]);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate`,
        { message: userInput, id: location.pathname.split("/")[2] }
      );
      const userRef = doc(db, 'users', user.uid);
      const userChatsRef = doc(userRef, 'chats', location.pathname.split("/")[2]);
      const chatMessagesRef = collection(userChatsRef, 'messages')
      await addDoc(chatMessagesRef, {
        user: userInput,
        bot: response.data.message,
        timestamp: serverTimestamp(),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { bot: response.data.message },
      ]);

      console.log(response);
    } catch (error) {
      console.error("Error sending message to server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (userInput.trim() !== "") {
      sendMessageToServer();
      setUserInput("");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-5 relative overflow-hidden text-sm[17px]">
      <div id="message-area" className="space-y-4 flex-1 h-full overflow-y-auto pb-16 px-">
        {messages?.map((message) => {
          return (
            <>
                <div className="flex justify-end">
                  <div className="bg-gray-200 text-gray-800 p-2 rounded-lg ml-4 flex items-center">
                    <div>
                      {message.user}
                    </div>
                  </div>
                </div>
                {message.bot &&
                <div className="flex justify-start">
                  <div className="bg-accent-500 w-[85%] text-white p-2 rounded-lg mr-4 flex items-center">
                    <div style={{"white-space": "pre-line"}}>
                      {message.bot}
                    </div>
                  </div>
                </div>
                }
            </>
          )
        })}
        {
          loading && <div className="flex justify-start">
            <div className="bg-accent-500 space-x-2 text-white p-2 rounded-lg mr-4 flex items-center">
              <div className='h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-3 w-3 bg-white rounded-full animate-bounce'></div>
            </div>
          </div>
        }
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white p-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          id="chat"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ask Questions"
          required
        />
        <button
          onClick={handleSend}
          className="flex cursor-pointer items-center justify-center rounded-r-md bg-accent-500 px-5 py-3 text-white"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default MessageArea;
