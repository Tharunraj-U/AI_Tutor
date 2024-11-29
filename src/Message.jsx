import React, { useEffect, useRef } from "react";
import "./Message.css";
import bot from "./assets/technology.png";
import user from "./assets/panda.png";

const Message = ({ text, sender }) => {
  const messageEndRef = useRef(null);

  // Scroll to the bottom every time a new message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [text]);  // Trigger scroll when text changes

  return (
    <div className={`message ${sender}`}>
      <div className="content">
        {sender === "bot" && <img src={bot} alt="Bot" />}
        {sender === "user" && <img src={user} alt="User" />}
        <p>{text}</p>
      </div>
      {/* This is the reference for the last message */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default Message;
