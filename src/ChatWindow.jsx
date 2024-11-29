import React, { useEffect, useRef } from "react";
import Message from "./Message";
import "./ChatWindow.css";

const ChatWindow = ({ messages }) => {
  // Create a ref for the message container
  const chatWindowRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      // Ensure we scroll to the bottom of the chat container
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]); // Trigger the effect when the messages array changes

  return (
    <div className="chat-window" ref={chatWindowRef}>
      <div className="message-container">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
