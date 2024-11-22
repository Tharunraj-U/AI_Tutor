import React, { useState, useEffect } from "react";
import "./Voice.css"; // Make sure the CSS file is properly linked

const Voice = ({ aimessage }) => {
  const [text, setText] = useState(aimessage); // Input text for TTS
  const [voices, setVoices] = useState([]); // List of available voices
  const [selectedVoice, setSelectedVoice] = useState(null); // Selected voice
  const [isSpeaking, setIsSpeaking] = useState(false); // Speaking state

  // Update text whenever aimessage changes
  useEffect(() => {
    setText(aimessage);
    if (aimessage) handleSpeak(); // Automatically speak on message update
  }, [aimessage]);

  // Load available voices and select default
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Attempt to select a female voice by default
      const femaleVoice = availableVoices.find((voice) =>
        voice.name.toLowerCase().includes("hazel")
      );
      if (femaleVoice) setSelectedVoice(femaleVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices; // Refresh voices when changed
  }, []);

  // Handle speaking the text
  const handleSpeak = () => {
    if (!text.trim()) return; // Do nothing if text is empty

    const utterance = new SpeechSynthesisUtterance(text); // Create utterance object
    // Set the selected voice if available
    if (selectedVoice) utterance.voice = selectedVoice;

    setIsSpeaking(true);

    // Reset state when done speaking
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const handleStop = () => {
    window.speechSynthesis.cancel(); // Stop speaking immediately
    setIsSpeaking(false);
  };

  // Handle voice selection change
  const handleVoiceChange = (event) => {
    const selectedVoice = voices.find(
      (voice) => voice.name === event.target.value
    );
    setSelectedVoice(selectedVoice);
  };

  return (
    <div className="voice-container">
      <div className="status-indicator">
        <div
          className={`status-dot ${isSpeaking ? "speaking" : ""}`}
        ></div>
        <p>Speaking: {isSpeaking ? "Yes" : "No"}</p>
      </div>
      <div className="control-buttons">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="voice-button speak-button"
        >
          Speak
        </button>
        <button
          onClick={handleStop}
          disabled={!isSpeaking}
          className="voice-button stop-button"
        >
          Stop
        </button>
      </div>

      {/* Voice selector */}
      <div className="voice-select-container">
        <label htmlFor="voice-select" className="voice-select-label">
          Select Voice:
        </label>
        <select
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice ? selectedVoice.name : ""}
          disabled={isSpeaking}
          className="voice-select"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Voice;
