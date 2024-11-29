import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Voice from "./Voice";

const Ai = ({ usermessage, setBotmessage, setUserMessage }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const [aimessage, setAiMessage] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Define the generative AI model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (isFirstMessage) {
      sendInitialPrompt();
    } else if (usermessage) {
      generateResponse(usermessage);
    }
  }, [usermessage, isFirstMessage]);

  // Initial tutor prompt
  const sendInitialPrompt = async () => {
    const initialPrompt = `
      You are an AI English language tutor. Your goal is to:
      1. Help students learn and practice English
      2. Explain grammar concepts clearly
      3. Provide interactive learning experiences
      4. Correct language mistakes
      5. Adapt to the student's learning level

      Start by introducing yourself and asking about the student's English learning goals.
    `;

    try {
      const result = await model.generateContent(initialPrompt);
      const aiResponse = await result.response.text();

      // Remove markdown formatting
      const cleanResponse = aiResponse.replace(/\*\*\*/g, '').replace(/\*\*/g, '');
      
      
      setIsFirstMessage(false);
    } catch (error) {
      console.error("Error sending initial prompt:", error);
      setBotmessage("Welcome! I'm ready to help you learn English.");
    }
  };

  // Generate response
  const generateResponse = async (inputPrompt) => {
    try {
      const result = await model.generateContent(inputPrompt);
      let aiResponse = await result.response.text();

      // Remove all markdown formatting
      aiResponse = aiResponse
        .replace(/\*\*\*/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      setBotmessage(aiResponse);
      setAiMessage(aiResponse);
    } catch (error) {
      console.error("Error generating response:", error);
      setBotmessage("Sorry, I couldn't process that. Please try again!");
    }
  };

  return <Voice aimessage={aimessage} userMessage={usermessage} />;
};

export default Ai;