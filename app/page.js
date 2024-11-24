"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CameraCapture from "./components/pagecomponent/capture";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" && !selectedImage) return;

    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "text", content: input },
        { sender: "bot", type: "text", content: "Thinking..." },
      ]);
      setInput("");

      setLoading(true);
      try {
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: input,
            type: "text",
            llm_name: "Meta-Llama",
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch response");

        const data = await response.json();

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "bot",
            type: "text",
            content: data.response,
          };
          return newMessages;
        });
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", content: "Sorry, I couldn't process your request." },
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedImage) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "image", content: URL.createObjectURL(selectedImage) },
      ]);
      setSelectedImage(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleCapture = (imageUrl) => {
    const capturedImage = dataURLtoFile(imageUrl, "captured_image.png");
    setSelectedImage(capturedImage);
    setIsCameraOpen(false);
  };

  return (
    <div className="flex justify-center items-center bg-[#121212] text-white h-screen">
      <div className="w-full max-w-screen h-full bg-[#1e1e1e] min-h-screen rounded-lg shadow-lg flex flex-col">
        <div className="bg-[#292929] p-4 text-center text-lg font-semibold border-b border-gray-700">
          AI Chatbot for Smart City Complain System
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-140px)]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.type === "text" ? (
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-[#4CAF50] text-white"
                      : "bg-[#2e2e2e] text-gray-300"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div>
                  <img
                    src={msg.content}
                    alt="Sent content"
                    className="max-w-[200px] rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {selectedImage && (
          <div className="p-4">
            <p className="text-sm text-gray-400">Image Preview:</p>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="max-w-full rounded-lg mb-2"
            />
          </div>
        )}
        <div className="p-4 border-t border-gray-700 bg-[#292929] flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask about Smart City..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 bg-[#1e1e1e] text-gray-300 rounded-lg outline-none border border-gray-600 focus:border-[#4CAF50]"
          />
          <button
            onClick={handleSend}
            className="bg-[#4CAF50] px-4 py-2 rounded-lg text-white hover:opacity-90"
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
        {isCameraOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex justify-center items-center">
            <CameraCapture onCapture={handleCapture} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
