#  AI-Powered Intelligent Recipe Suggestion Assistant

This is a full-stack AI-powered application that generates structured, human-like cooking recipes using either:

-  **Google Gemini Pro Vision** (multimodal: text + image)
-  **Hugging Face FLAN-T5** (text-only)

You can input ingredients, select preferences like cuisine or complexity, or even upload an image of ingredients (for Gemini), and receive a complete recipe including a title, ingredients list, and step-by-step instructions.

---

##  How It Works

-  **Text Input**: Type ingredients and preferences → AI generates recipe.
-  **Image Input** *(Gemini only)*: Upload a picture of ingredients or a dish → Gemini analyzes it and generates a recipe.
-  **Model Options**:
  - **Gemini Pro Vision**: Accepts image + text, generates more detailed outputs.
  - **Hugging Face FLAN-T5**: Fast and lightweight, text-only input.

---

##  Screenshots

![image](https://github.com/user-attachments/assets/fb03bc91-23db-4f1f-ba19-87f2cefb67ad)


---

##  How to Set Up Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Fang1331/AI-Powered-Intelligent-Recipe-Suggestion-Assistant.git
cd AI-Powered-Intelligent-Recipe-Suggestion-Assistant
```

---

### 2. Backend Setup (Flask)

```bash
cd server
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate  # On macOS/Linux

pip install -r requirements.txt
```

---

### 3. Get Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey  
2. Generate an API key
3. Create a `.env` file inside the `server/` folder and add:

```
GEMINI_API_KEY=your_actual_api_key_here
```

 This file is listed in `.gitignore` so it won’t be committed to GitHub.

---

### 4. Run the Backend

```bash
python server.py
```

This starts your Flask API at `http://localhost:5000`.

---

### 5. Frontend Setup (React)

In a **new terminal window**:

```bash
cd ../client
npm install
npm start
```

This launches the React app at `http://localhost:3000`.

---

##  How to Use

1. Enter ingredients (required).
2. Choose AI model: Gemini or Hugging Face.
3. If using **Gemini**, you can also upload an image.
4. Select meal type, cuisine, cooking time, and complexity.
5. Click **Generate Recipe**.
6. View:
   - Recipe Title
   - Ingredients List
   - Step-by-step Instructions

---

##  Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React, Tailwind CSS |
| Backend    | Flask (Python) |
| AI Models  | Gemini Pro Vision, Hugging Face FLAN-T5 |
| Tools      | OpenCV, Pillow, Transformers, dotenv |

---

##  Project Structure

```
AI-Powered-Intelligent-Recipe-Suggestion-Assistant/
├── client/         # React frontend
├── server/         # Flask backend
│   ├── server.py
│   ├── .env               # Your Gemini API key (not committed)
│   └── requirements.txt
├── assets/         # (Optional) store images/screenshots
├── README.md
└── .gitignore
```

---



##  License

MIT License © 2025 Aryan Rai
