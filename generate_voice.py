from gtts import gTTS
import os

# English
en_text = """Here is the brand new solution for Financial Inclusion! This application empowers farmers and small businesses by assessing crop choices, predicting yields, and helping with loan approvals. We also help to get insurance, connect with the PDS system under MSP contracts for better supply chain management."""
en_tts = gTTS(en_text, lang='en')
en_tts.save("public/bot_voice_en.mp3")  # Put inside React public folder

# Hindi
hi_text = """यह वित्तीय समावेशन के लिए एक नया समाधान है! यह एप्लिकेशन किसानों और छोटे व्यवसायों को फसल चयन का मूल्यांकन करने, उपज की भविष्यवाणी करने, और ऋण अनुमोदन में सहायता करता है। हम बीमा प्राप्त करने, एमएसपी अनुबंधों के तहत सार्वजनिक वितरण प्रणाली से जुड़ने में भी मदद करते हैं।"""
hi_tts = gTTS(hi_text, lang='hi')
hi_tts.save("public/bot_voice_hi.mp3")  # Put inside React public folder
