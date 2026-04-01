import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ChatbotFAB from './ChatbotFAB';
import { useLanguage } from '../contexts/LanguageContext';
import './ChatBot.css';

const getSpeechLang = (lang) => (lang === 'hi' ? 'hi-IN' : 'en-IN');

const ChatBot = () => {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [responseSource, setResponseSource] = useState(null);
    const [messages, setMessages] = useState([
        {
            sender: 'AI',
            text: 'Hello! I am the Bharat Policy Assistant. How can I help you navigate the dashboard today?',
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const [isSpeechSupported, setIsSpeechSupported] = useState(true);
    const [voiceLanguage, setVoiceLanguage] = useState(language);
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const [isTtsSupported, setIsTtsSupported] = useState(true);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const inputSnapshotRef = useRef('');
    const lastSpokenIndexRef = useRef(-1);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        setVoiceLanguage(language);
    }, [language]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSpeechSupported(Boolean(SpeechRecognition));
        setIsTtsSupported(Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance));

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = getSpeechLang(voiceLanguage);
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const baseText = inputSnapshotRef.current.trim();
            const combinedFinal = [baseText, finalTranscript.trim()].filter(Boolean).join(' ');
            const combinedInterim = [baseText, interimTranscript.trim()].filter(Boolean).join(' ');

            if (combinedFinal) {
                setInput(combinedFinal);
            } else if (combinedInterim) {
                setInput(combinedInterim);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setSpeechError(
                    voiceLanguage === 'hi'
                        ? 'माइक्रोफोन की अनुमति चाहिए.'
                        : 'Microphone permission is required.'
                );
            } else if (event.error !== 'aborted') {
                setSpeechError(
                    voiceLanguage === 'hi'
                        ? 'आवाज़ पहचान अभी उपलब्ध नहीं है.'
                        : 'Speech recognition is not available right now.'
                );
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.abort();
            recognitionRef.current = null;
        };
    }, [voiceLanguage]);

    useEffect(() => {
        if (!ttsEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, [ttsEnabled]);

    useEffect(() => {
        if (!isOpen && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!ttsEnabled || isTyping || messages.length === 0) return;

        const lastIndex = messages.length - 1;
        if (lastSpokenIndexRef.current === lastIndex) return;

        const latestMessage = messages[lastIndex];
        if (latestMessage?.sender !== 'AI') return;

        const text = (latestMessage.text || '').trim();
        if (!text || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = getSpeechLang(voiceLanguage);
        utterance.rate = 0.98;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        const preferredVoice =
            voices.find((voice) => voice.lang?.toLowerCase().startsWith(voiceLanguage === 'hi' ? 'hi' : 'en')) ||
            voices.find((voice) => voice.lang?.toLowerCase() === utterance.lang.toLowerCase()) ||
            voices.find((voice) => voice.lang?.toLowerCase().startsWith('en')) ||
            voices.find((voice) => voice.lang?.toLowerCase().startsWith('hi'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        lastSpokenIndexRef.current = lastIndex;

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [messages, ttsEnabled, isTyping, voiceLanguage]);

    const buildHistoryPayload = (historyMessages) => {
        return historyMessages.slice(-4).map((message) => ({
            role: message.sender === 'AI' ? 'assistant' : 'user',
            content: message.text,
        }));
    };

    const handleMicClick = () => {
        if (!isSpeechSupported) {
            setSpeechError(
                voiceLanguage === 'hi'
                    ? 'यह ब्राउज़र voice input support नहीं करता.'
                    : 'This browser does not support voice input.'
            );
            return;
        }

        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            return;
        }

        setSpeechError('');
        inputSnapshotRef.current = input;

        try {
            recognition.lang = getSpeechLang(voiceLanguage);
            recognition.start();
            setIsListening(true);
        } catch (error) {
            setSpeechError(
                voiceLanguage === 'hi'
                    ? 'माइक्रोफोन शुरू नहीं किया जा सका.'
                    : 'Could not start microphone.'
            );
            setIsListening(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const recognition = recognitionRef.current;
        if (recognition && isListening) {
            recognition.stop();
        }

        const userMessage = input.trim();
        const historyForRequest = buildHistoryPayload(messages);

        setMessages((prev) => [...prev, { sender: 'User', text: userMessage }]);
        setResponseSource(null);
        setInput('');
        setIsTyping(true);
        setSpeechError('');
        lastSpokenIndexRef.current = -1;

        try {
            const response = await fetch('http://localhost:8000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: historyForRequest,
                    current_language: language,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const nextSource = data.source === 'database_augmented' ? 'database_augmented' : null;
            setResponseSource(nextSource);
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'AI',
                    text: data.answer || data.response || 'Sorry, I could not generate a response.',
                    source: nextSource,
                    detectedIntent: data.detected_intent || null,
                },
            ]);
        } catch (error) {
            console.error('Error fetching chat response:', error);
            setResponseSource(null);
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'AI',
                    text: 'Sorry, I am having trouble connecting to the server.',
                    source: null,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const speakToggleLabel = ttsEnabled
        ? (voiceLanguage === 'hi' ? 'आवाज़ बंद करें' : 'Turn voice off')
        : (voiceLanguage === 'hi' ? 'आवाज़ में पढ़ें' : 'Read replies aloud');

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div key={language} className="chatbot-window" data-latest-source={responseSource || 'none'}>
                    <div className="chatbot-header">
                        <div className="chatbot-header-title">
                            <MessageCircle size={20} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <h3 style={{ margin: 0 }}>BPIS Assistant</h3>
                                <span className="chatbot-header-subtitle">
                                    {voiceLanguage === 'hi' ? 'Hindi / English Voice' : 'English / Hindi Voice'}
                                </span>
                            </div>
                        </div>

                        <div className="chatbot-header-actions">
                            <div className="chatbot-lang-switch" role="group" aria-label="Voice language selector">
                                <button
                                    type="button"
                                    className={`chatbot-lang-chip ${voiceLanguage === 'en' ? 'active' : ''}`}
                                    onClick={() => setVoiceLanguage('en')}
                                    aria-pressed={voiceLanguage === 'en'}
                                    title={language === 'hi' ? 'वॉइस इनपुट English में' : 'Voice input in English'}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    className={`chatbot-lang-chip ${voiceLanguage === 'hi' ? 'active' : ''}`}
                                    onClick={() => setVoiceLanguage('hi')}
                                    aria-pressed={voiceLanguage === 'hi'}
                                    title={language === 'hi' ? 'वॉइस इनपुट Hindi में' : 'Voice input in Hindi'}
                                >
                                    HI
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setTtsEnabled((current) => !current);
                                    setSpeechError('');
                                }}
                                className={`chatbot-tts-btn ${ttsEnabled ? 'enabled' : ''}`}
                                aria-label={speakToggleLabel}
                                title={speakToggleLabel}
                                disabled={!isTtsSupported}
                            >
                                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="chatbot-close-btn"
                                aria-label="Close Chat"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chatbot-message-row ${msg.sender === 'User' ? 'user' : 'ai'}`}>
                                <div className={`chatbot-bubble ${msg.sender === 'User' ? 'user' : 'ai'}`}>
                                    {msg.text}
                                    {msg.sender === 'AI' && msg.source === 'database_augmented' && (
                                        <div className="chatbot-meta">
                                            <span className="chatbot-verified-badge" title="Response grounded in BPIS database">
                                                Verified Data
                                            </span>
                                        </div>
                                    )}
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
                        <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={!isSpeechSupported || isTyping}
                            className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`}
                            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                            aria-pressed={isListening}
                            title={
                                !isSpeechSupported
                                    ? (language === 'hi' ? 'आपका ब्राउज़र voice input support नहीं करता' : 'Your browser does not support voice input')
                                    : isListening
                                        ? (voiceLanguage === 'hi' ? 'सुन रहा है...' : 'Listening...')
                                        : (voiceLanguage === 'hi' ? 'माइक दबाकर बोलें' : 'Tap mic and speak')
                            }
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={voiceLanguage === 'hi' ? 'यहाँ टाइप करें या mic दबाएँ...' : 'Type a message or press mic...'}
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
                    <div className="chatbot-footer-meta">
                        {speechError && <span className="chatbot-live-error">{speechError}</span>}
                    </div>
                </div>
            ) : (
                <ChatbotFAB onClick={() => setIsOpen(true)} />
            )}
        </div>
    );
};

export default ChatBot;
