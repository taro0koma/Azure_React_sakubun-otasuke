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

    // Update chat history with the user's message
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: userMessage },
    ];
    setChatHistory(updatedChatHistory);

    try {
      // Call the Python API
      const response = await fetch("https://react-sakubun-otasuke-azure-openai.onrender.com/api/chat", {
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

      // Update chat history with the AI's response
      setChatHistory([
        ...updatedChatHistory,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Error: Unable to fetch AI response.");
    } finally {
      setLoading(false);
      setUserMessage(""); // Clear input field
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
            <strong>{message.role === "user" ? "User:" : "AI:"}</strong>{" "}
            {message.content}
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
