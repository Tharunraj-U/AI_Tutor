import React from "react";
import "./Message.css";
import female from "./assets/female.png"

const Message = ({ text, sender }) => {
  return (
    <div   className={`message ${sender}`}>
      <div className="content">
      {sender==="bot" && <img src={female} alt="Bot"></img>}
        <p>{text}</p>
        </div>
    </div>
  );
};

export default Message;
