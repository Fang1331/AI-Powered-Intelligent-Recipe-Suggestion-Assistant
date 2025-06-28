from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
from dotenv import load_dotenv 

load_dotenv() 

app = Flask(__name__)
CORS(app)
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

gemini_model = genai.GenerativeModel("models/gemini-1.5-flash")

# === Load Hugging Face model ===
hf_model_name = "google/flan-t5-base"
hf_tokenizer = AutoTokenizer.from_pretrained(hf_model_name)
hf_model = AutoModelForSeq2SeqLM.from_pretrained(hf_model_name)

@app.route("/generate_recipe", methods=["POST"])
def generate_recipe():
    data = request.get_json()
    ingredients = data.get("ingredients", "").strip()
    meal_type = data.get("mealType", "").strip()
    cuisine = data.get("cuisine", "").strip()
    cooking_time = data.get("cookingTime", "").strip()
    complexity = data.get("complexity", "").strip()
    source = data.get("use", "gemini").strip().lower()  # "gemini" or "huggingface"

    if not ingredients:
        return jsonify({"error": "No ingredients provided."}), 400

    try:
        if source == "gemini":
            # === Gemini Prompt (detailed) ===
            gemini_prompt = f"""
            Generate a cooking recipe using the following:
            - Ingredients: {ingredients}
            - Meal Type: {meal_type or "Any"}
            - Cuisine: {cuisine or "Any"}
            - Cooking Time: {cooking_time or "Flexible"}
            - Complexity: {complexity or "Any"}

            Return the recipe with a title, ingredients list, and step-by-step instructions.
            """
            response = gemini_model.generate_content(gemini_prompt)
            recipe = response.text

        else:
            # === Hugging Face Prompt (only ingredients + complexity) ===
            hf_prompt = (
                f"Create a recipe using these ingredients: {ingredients}. "
                f"The recipe should be suitable for a {complexity.lower() if complexity else 'beginner'} cook. "
                f"Include a title, list of ingredients, and step-by-step instructions."
            )
            inputs = hf_tokenizer(hf_prompt, return_tensors="pt", truncation=True)
            outputs = hf_model.generate(**inputs, max_length=512, num_beams=4, early_stopping=True)
            recipe = hf_tokenizer.decode(outputs[0], skip_special_tokens=True)

        return jsonify({"recipe": recipe})

    except Exception as e:
        return jsonify({"error": f"Failed to generate recipe: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
