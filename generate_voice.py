from gtts import gTTS

text = "Welcome to Arushi! This application empowers farmers and small businesses by assessing crop choices, predicting yields, and helping with loan approvals. We also help connect with the PDS system under MSP contracts for better supply chain management."

tts = gTTS(text)
tts.save("public/bot_voice.mp3")  # This path is relative to your React app folder
