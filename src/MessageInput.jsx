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
      instance.continuous = false; // Only take the final transcript, no continuous results
      instance.interimResults = true; // Allow interim results (to update the input as speech happens)
      return instance;
    }
    return null;
  }, []);

  useEffect(() => {
    if (isListening) {
      setMic(mic2);
      setMicClass("mic2");
    } else {
      setMic(mic1);
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
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        let finalTranscript = "";

        // Loop through all results, and only use final results (avoid interim)
        for (let i = event.results.length - 1; i >= 0; i--) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript = transcript; // Use final result only
            break; // Stop processing further once final result is found
          }
        }

        setInputText(finalTranscript); // Set the input text to the final transcript
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false); // Stop listening once the recognition ends
        if (inputText.trim()) {
          handleSend(); // Automatically send the message after recognition ends if there's input
        }
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
