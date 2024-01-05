import React, { useState, useEffect } from 'react';
import './Chat.css';

function Chat({messages}) {

    return (
        <div className="chat-container">
            {messages.map((msg, index) => (
                <div key={index} className={msg.ai ? "message-ai" : "message-me"}>
                    {msg.text}
                </div>
            ))}
        </div>
    );
}

export default Chat;