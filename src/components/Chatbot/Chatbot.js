import React, { useState } from "react";
import Lottie from "lottie-react";
import assistantChatbot from "../../assets/AssistantGreenRobot.json";
import "./Chatbot.scss";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        // sau này bạn sẽ call API AskYourDatabase tại đây
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: "bot", text: "Đang xử lý câu hỏi..." }]);
        }, 400);
    };

    return (
        <div className="chatbot-wrapper">
            {/* ICON ROBOT */}
            <div className="chatbot-icon" onClick={toggleChat}>
                <Lottie animationData={assistantChatbot} loop={true} />
            </div>

            {/* KHUNG CHAT */}
            <div className={`chat-window ${isOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <span>Chat hỗ trợ</span>
                    <button className="close-btn" onClick={toggleChat}>×</button>
                </div>

                <div className="chat-body">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nhập câu hỏi..."
                    />
                    <button onClick={sendMessage}>Gửi</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
