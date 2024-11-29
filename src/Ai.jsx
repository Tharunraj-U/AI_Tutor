import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Voice from "./Voice";


const Ai = ({ usermessage, setBotmessage,setUserMessage }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const [aimessage,setAiMessage]=useState("");
  console.log(apiKey)

  // Define the generative AI model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (usermessage) {
      generateResponse(usermessage); // Trigger AI response generation if prompt changes
    }
  }, [usermessage]);

  // Function to send prompt to the AI model and handle response
  const generateResponse = async (inputPrompt) => {
    try {
      const result = await model.generateContent(inputPrompt);
      const aiResponse = await result.response.text(); // Get AI-generated text

      // Add the AI response to the chat
      setBotmessage(aiResponse)
      setAiMessage(aiResponse)
    } catch (error) {
      console.error("Error generating content:", error);

      // Handle error by adding a fallback message
      setBotmessage("Sorry, I couldn't process that. Please try again!");
    }
  };

  return (
  <> <Voice  aimessage={aimessage}  userMessage={usermessage}/> </>); // No visible UI for this component, as it's only a logic handler
};

export default Ai;
