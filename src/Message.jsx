import React from "react";
import "./Message.css";
import bot from "./assets/technology.png"
import user from "./assets/panda.png"

const Message = ({ text, sender }) => {
  return (
    <div   className={`message ${sender}`}>
      <div className="content">
      {sender==="bot" && <img src={bot} alt="Bot"></img>}
      {sender==="user" && <img src={user} alt="Bot"></img>}
      
        <p>{text}</p>
        </div>
    </div>
  );
};

export default Message;
