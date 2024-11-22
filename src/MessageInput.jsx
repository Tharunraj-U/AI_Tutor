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
      instance.continuous = true;
      instance.interimResults = true;
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
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        setInputText(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return; // Prevent sending empty messages
    sendMessage(inputText);
    setInputText("");
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
