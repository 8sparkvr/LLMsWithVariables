import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import MessageInput from './MessageInput';
import VariableList from './VariableList';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL to match your server

function App() {
    const [messages, setMessages] = useState([]);
    const [variables, setVariables] = useState([]);

    useEffect(() => {
        socket.on('you message', (msg) => {
            setMessages((msgs) => [...msgs, {text: msg, ai: false}]);
        });
        socket.on('ai message', (msg) => {
            setMessages((msgs) => [...msgs, {text:msg, ai: true}]);
        });
        socket.on('getVars', (msg) => {
            console.log('getVars', msg);
            setVariables(msg);
        });
    }, []);

    const handleSendMessage = (newMessage) => {
        socket.emit('chat message', newMessage);
    };
    
    const handleSetVars = (vars) => {
        console.log("handleSetVars", vars);
        socket.emit('setVars', vars);
    };

    const resetChat = () => {
        setMessages([]);
        socket.emit("reset");
    }

    return (
        <div className="app">
            <h1>LLMs With Variables</h1>
            <Chat messages={messages}/>
            <MessageInput onSendMessage={handleSendMessage} />
            <VariableList handleSetVars={handleSetVars} setVariables={setVariables} variables={variables} resetChat={resetChat}/>
        </div>
    );
}

export default App;
