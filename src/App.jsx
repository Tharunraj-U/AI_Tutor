import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import Ai from "./Ai";
import Voice from "./Voice";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello!", sender: "bot" },
    { text: "Hi!  I am your AI  Tutor", sender: "bot" },
    {text: "Shall we Start Now", sender: "bot"}
  ]);
  const [usermessage, setUserMessage] = useState("");
  const [aimessage, setAiMessage] = useState(""); // Store the user's last message

  // Function to send a message from the user
  const sendMessage = (messageText) => {
    if (messageText.trim() !== "") {
      const newMessage = { text: messageText, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Set the user's message for AI to process
      setUserMessage(messageText);

      // Add a temporary "AI is thinking..." message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "AI is thinking...", sender: "bot" },
      ]);
    }
  };
  const clearMessage=()=>{
    setUserMessage("");
  } 
  // Function to send a message from the bot (AI response)
  const setBotmessage = (messageText) => {
    if (messageText.trim() !== "") {
      setMessages((prevMessages) => {
        // Remove the "AI is thinking..." message before adding the AI response
        const filteredMessages = prevMessages.filter(
          (message) => message.text !== "AI is thinking..."
        );
        setAiMessage(messageText);
        return [...filteredMessages, { text: messageText, sender: "bot" }];
      });
    }
  };

   return (
    <div className="app">
       <Ai usermessage={usermessage} setBotmessage={setBotmessage} setUserMessage={clearMessage} />
      <ChatWindow messages={messages} />
      {/* Pass setBotmessage and usermessage to Ai */}
      <MessageInput sendMessage={sendMessage} />
     
     
     
    </div>
  );
}

export default App;
