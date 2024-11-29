import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./Voice.css";

const Voice = ({ aimessage }) => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const utteranceRef = useRef(null);
  const chunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);

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

  // Split long text into chunks of 25 words each
  const splitTextIntoChunks = useCallback((longText) => {
    const cleanedText = longText
      .replace(/\*\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .trim();

    const words = cleanedText.split(/\s+/);
    const chunks = [];

    // Split text into chunks of 25 words
    for (let i = 0; i < words.length; i += 25) {
      chunks.push(words.slice(i, i + 25).join(" "));
    }

    return chunks;
  }, []);

  // Speak chunks sequentially
  const speakChunks = useCallback(() => {
    if (currentChunkIndexRef.current >= chunksRef.current.length) {
      setIsSpeaking(false); // Finished speaking all chunks
      currentChunkIndexRef.current = 0; // Reset chunk index
      return;
    }

    const currentChunk = chunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(currentChunk);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.rate = 0.9; // Normal speaking rate
      utterance.pitch = 1.0; // Normal pitch
    }

    // On start and end events to update speaking status
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      currentChunkIndexRef.current++;
      speakChunks(); // Continue to next chunk after this one finishes
    };
    utterance.onerror = () => setIsSpeaking(false); // If error occurs, stop speaking

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  // Trigger speech when message changes
  useEffect(() => {
    if (aimessage) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Split the message into chunks
      chunksRef.current = splitTextIntoChunks(aimessage);
      currentChunkIndexRef.current = 0;

      // Start speaking chunks
      speakChunks();
    }
  }, [aimessage, splitTextIntoChunks, speakChunks]);

  // Manual stop function
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    currentChunkIndexRef.current = 0; // Reset chunk index
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
        <p style={{ color: "white" }}>
  Speaking: {isSpeaking ? "Yes" : "No"}
</p>

      </div>

      <div className="control-buttons">
        <button
          onClick={speakChunks}
          disabled={isSpeaking || !aimessage}
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
