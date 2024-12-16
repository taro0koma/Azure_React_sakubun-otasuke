import React, { useState } from "react";

const ChatWithAI = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "system", content: "Assistant is a large language model trained by OpenAI." },
  ]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setLoading(true);

    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: userMessage },
    ];
    setChatHistory(updatedChatHistory);

    try {
      const response = await fetch(process.env.REACT_APP_AZURE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedChatHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      setAiResponse(data.reply);

      setChatHistory([
        ...updatedChatHistory,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Error: Unable to fetch AI response.");
    } finally {
      setLoading(false);
      setUserMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={message.role === "user" ? "user-message" : "ai-message"}
          >
            <strong>{message.role === "user" ? "User:" : "AI:"}</strong> {message.content}
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      <div className="input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithAI;
