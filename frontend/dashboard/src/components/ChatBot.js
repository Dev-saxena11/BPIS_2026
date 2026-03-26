import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import './ChatBot.css'; // Import standard CSS to fix the un-styled component issue

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'AI', text: 'Hello! I am the Bharat Policy Assistant. How can I help you navigate the dashboard today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { sender: 'User', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: 'AI', text: data.response }]);
        } catch (error) {
            console.error('Error fetching chat response:', error);
            setMessages((prev) => [...prev, { sender: 'AI', text: 'Sorry, I am having trouble connecting to the server.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-title">
                            <MessageCircle size={20} />
                            <h3 style={{ margin: 0 }}>BPIS Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="chatbot-close-btn" aria-label="Close Chat">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chatbot-message-row ${msg.sender === 'User' ? 'user' : 'ai'}`}>
                                <div className={`chatbot-bubble ${msg.sender === 'User' ? 'user' : 'ai'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chatbot-message-row ai">
                                <div className="chatbot-bubble ai chatbot-typing">
                                    <div className="chatbot-dot"></div>
                                    <div className="chatbot-dot"></div>
                                    <div className="chatbot-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="chatbot-input"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="chatbot-send-btn"
                            aria-label="Send Message"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chatbot-fab"
                    aria-label="Open Chat"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default ChatBot;
