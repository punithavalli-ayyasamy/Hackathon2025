import os
from dotenv import load_dotenv  # this was the error earlier
import google.generativeai as genai
from flask import Flask, request, render_template

# Load environment variables from .env
load_dotenv()

# Set API key from .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize model
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Flask setup
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.form["question"]
    try:
        response = model.generate_content([user_input])
        # Access text depending on library version
        try:
            answer = response.text
        except AttributeError:
            answer = response.candidates[0].content.parts[0].text
    except Exception as e:
        answer = f"Error: {str(e)}"

    return render_template("index.html", question=user_input, answer=answer)

@app.route("/loan")
def loan():
    return "<h2>Loan Application Page Coming Soon</h2>"

@app.route("/training")
def training():
    return "<h2>Training Programs Page Coming Soon</h2>"

@app.route("/assessment")
def assessment():
    return "<h2>Assessment Page Coming Soon</h2>"

if __name__ == "__main__":
    app.run(debug=True)
