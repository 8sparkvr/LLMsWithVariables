import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ messages }) {

    
  const chatContainerRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.ai ? "message-ai" : "message-me"}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default Chat;