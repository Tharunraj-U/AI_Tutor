import React, { useEffect, useState, useMemo } from "react";
import "./MessageInput.css";
import mic1 from "./assets/voice.png";
import mic2 from "./assets/voice2.png";

const MessageInput = ({ sendMessage }) => {
  const [inputText, setInputText] = useState("");
  const [mic, setMic] = useState(mic1);
  const [micClass, setMicClass] = useState("mic1");
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = useMemo(() => {
    if (SpeechRecognition) {
      const instance = new SpeechRecognition();
      instance.continuous = false; // Disable continuous listening, so we get final results only
      instance.interimResults = false; // Disable interim results to avoid repeated words
      return instance;
    }
    return null;
  }, []);

  useEffect(() => {
    if (isListening) {
      setMic(mic2); // Change microphone icon to indicate listening
      setMicClass("mic2");
    } else {
      setMic(mic1); // Default microphone icon when not listening
      setMicClass("mic1");
    }
  }, [isListening]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSend();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputText]);

  const startListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop(); // Stop listening if already listening
      setIsListening(false);
    } else {
      recognition.start(); // Start listening when microphone is clicked
      setIsListening(true);

      recognition.onresult = (event) => {
        let finalTranscript = "";

        // Process only the final transcript (not interim)
        for (let i = event.results.length - 1; i >= 0; i--) {
          if (event.results[i].isFinal) {
            finalTranscript = event.results[i][0].transcript; // Get the final result
            break; // Stop at the first final result
          }
        }

        setInputText(finalTranscript); // Set the input text to the final result
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // After recognition ends, send the message and clear the input field
        setIsListening(false); // Stop the listening state
        handleSend(); // Automatically send the message
      };
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return; // Prevent sending empty messages
    sendMessage(inputText); // Send the message
    setInputText(""); // Clear the input field after sending
  };

  if (!SpeechRecognition) {
    return (
      <div className="unsupported-message">
        Your browser does not support speech recognition. Please try another browser.
      </div>
    );
  }

  return (
    <div className="message-input-container">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="message-input"
        placeholder="Type a message..."
      />
      <a onClick={startListening}>
        <img className={micClass} src={mic} alt="Microphone" />
      </a>
      <button onClick={handleSend} className="send-button">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
