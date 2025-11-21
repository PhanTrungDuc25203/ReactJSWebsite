import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import assistantChatbot from "../../assets/AssistantGreenRobot.json";
import "./Chatbot.scss";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");
    const toggleChat = () => setIsOpen(!isOpen);
    const fetchAydSession = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/ayd/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Guest", email: "guest@example.com" }),
            });
            const data = await res.json();
            setIframeUrl(data.url);
        } catch (err) {
            console.error("Lỗi khi tạo session AYD:", err);
        }
    };

    useEffect(() => {
        setIframeUrl(`https://www.askyourdatabase.com/chatbot/f7fbd201a6d6a7fcbcf843c18a6646bb`);
        const handleMessage = (event) => {
            if (event.data.type === "LOGIN_SUCCESS") {
                setIframeUrl(event.data.url);
            } else if (event.data.type === "LOGIN_REQUIRED") {
                fetchAydSession();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-icon" onClick={toggleChat}>
                <Lottie animationData={assistantChatbot} loop={true} />
            </div>
            <div className={`chat-window ${isOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <span>Trợ lý AI hỗ trợ</span>
                    <button className="close-btn" onClick={toggleChat}>
                        ×
                    </button>
                </div>

                <div className="chat-body">
                    <iframe allow="clipboard-read; clipboard-write" src={iframeUrl} style={{ width: "100%", height: "100%", border: "none" }}></iframe>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
