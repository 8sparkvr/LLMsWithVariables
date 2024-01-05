import React, { useState } from 'react';
import './MessageInput.css';

function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(message);
        setMessage('');
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
            />
            <button type="submit" className="send-button">Send</button>
        </form>
    );
}

export default MessageInput;
