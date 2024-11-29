import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./Voice.css";

const Voice = ({ aimessage }) => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const utteranceRef = useRef(null);

  // Load voices
  const loadVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);

    const preferredVoices = availableVoices.filter(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("hazel")
    );
    setSelectedVoice(preferredVoices[0] || availableVoices[0]);
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [loadVoices]);

  // Speak text when aimessage changes
  useEffect(() => {
    if (aimessage) {
      handleSpeak(aimessage);
    }
  }, [aimessage]);

  // Speak handler
  const handleSpeak = useCallback((textToSpeak) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    setText(textToSpeak);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  // Stop speaking
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Voice change handler
  const handleVoiceChange = useCallback(
    (event) => {
      const voice = voices.find((v) => v.name === event.target.value);
      setSelectedVoice(voice);
    },
    [voices]
  );

  // Memoize voice options
  const voiceOptions = useMemo(
    () =>
      voices.map((voice) => (
        <option key={voice.name} value={voice.name}>
          {voice.name} ({voice.lang})
        </option>
      )),
    [voices]
  );

  return (
    <div className="voice-container">
      <div className="status-indicator">
        <div className={`status-dot ${isSpeaking ? "speaking" : ""}`}></div>
        <p>Speaking: {isSpeaking ? "Yes" : "No"}</p>
      </div>

      <div className="control-buttons">
        <button
          onClick={() => handleSpeak(text)}
          disabled={isSpeaking || !text}
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

      <div className="voice-select-container">
        <label htmlFor="voice-select" className="voice-select-label">
          Select Voice:
        </label>
        <select
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice?.name || ""}
          disabled={isSpeaking}
          className="voice-select"
        >
          {voiceOptions}
        </select>
      </div>
    </div>
  );
};

export default Voice;