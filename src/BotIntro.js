import React, { useState, useRef } from 'react';
import './style.css';
import agriImage from './assets/agri-bg.jpg';

const BotIntro = () => {
  const [language, setLanguage] = useState('hi'); // auto-detect or set default
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const messages = {
    en: `Here is the brand new solution for Financial Inclusion! This application empowers farmers and small businesses by 
    assessing crop choices, predicting yields, and helping with loan approvals. 
    We also help to get insurance, connect with the PDS system under MSP contracts for better supply chain management.`,
    
    hi: `यह वित्तीय समावेशन के लिए एक नया समाधान है! यह एप्लिकेशन किसानों और छोटे व्यवसायों को 
    फसल चयन का मूल्यांकन करने, उपज की भविष्यवाणी करने, और ऋण अनुमोदन में सहायता करता है। 
    हम बीमा प्राप्त करने, एमएसपी अनुबंधों के तहत सार्वजनिक वितरण प्रणाली से जुड़ने में भी मदद करते हैं।`
  };

  const audioSources = {
    en: '/bot_voice_en.mp3',
    hi: '/bot_voice_hi.mp3'
  };

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className='parent'>
      <div className="bot-container">
        <img src={agriImage} alt="Agriculture" className="agri-image" />
        <div className="bot-text">{messages[language]}</div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioSources[language]}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="language-selector">
          <label htmlFor="lang">Language: </label>
          <select
            id="lang"
            value={language}
            onChange={(e) => {
              stopAudio();
              setLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="control-buttons">
          <div className="media-button-group">
            <button className="media-btn green-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            <button className="media-btn red-btn" onClick={stopAudio}>
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
