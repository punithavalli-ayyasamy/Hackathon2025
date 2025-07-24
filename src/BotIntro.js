import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import agriImage from './assets/agri-bg.jpg';

const BotIntro = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const utteranceRef = useRef(null);

  const message = `Here is the brand new solution for Financial Inclusion! This application empowers farmers and small businesses by 
  assessing crop choices, predicting yields, and helping with loan approvals. 
  We also help connect with the PDS system under MSP contracts for better supply chain management.`;

  useEffect(() => {
    speechSynthesis.cancel(); // Ensure no leftover utterances
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  const getVoice = () => {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find(v => v.name.includes('Google US English')) ||
      voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.gender === 'female') ||
      voices[0]
    );
  };

  const createUtterance = () => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    utterance.voice = getVoice();

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setIsStarted(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsStarted(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsStarted(false);
      utteranceRef.current = null;
    };

    return utterance;
  };

  const speakIntro = () => {
    // Resume if paused
    if (isPaused && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Ignore if already speaking
    if (speechSynthesis.speaking && !speechSynthesis.paused) return;

    // Clean up previous
    speechSynthesis.cancel();

    const utterance = createUtterance();
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setIsStarted(false);
  };

  return (
    <div className='parent'>
    <div className="bot-container">
      <img src={agriImage} alt="Agriculture" className="agri-image" />
      <div className="bot-text">{message}</div>

      <div className="control-buttons">
        <div className="media-button-group">
          <button
            className="media-btn green-btn"
            onClick={() => {
              if (isSpeaking) {
                pauseSpeech();
              } else {
                speakIntro();
              }
            }}
          >
            {isSpeaking ? '⏸' : '▶'}
          </button>

          <button className="media-btn red-btn" onClick={stopSpeech}>
            ⏹
          </button>
        </div>
      </div>

      <button
        className="next-btn large-next-btn"
        onClick={() => (window.location.href = '/features')}
      >
        Next →
      </button>
    </div>
    </div>
    
  );
};

export default BotIntro;
