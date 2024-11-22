import React from "react";
import Message from "./Message";
import "./ChatWindow.css";

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      <div className="message-container">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
