from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os
import torch
from dotenv import load_dotenv
from PIL import Image
import io
import cv2
import numpy as np

load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure Gemini with Vision
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")


# Load Hugging Face model
hf_model_name = "google/flan-t5-base"
hf_tokenizer = AutoTokenizer.from_pretrained(hf_model_name)
hf_model = AutoModelForSeq2SeqLM.from_pretrained(hf_model_name)


@app.route("/generate_recipe", methods=["POST"])
def generate_recipe():
    source = request.form.get("use", "gemini").strip().lower()
    ingredients = request.form.get("ingredients", "").strip()
    meal_type = request.form.get("mealType", "").strip()
    cuisine = request.form.get("cuisine", "").strip()
    cooking_time = request.form.get("cookingTime", "").strip()
    complexity = request.form.get("complexity", "").strip()

    try:
        if source == "gemini":
            image = request.files.get("image", None)

            # Build prompt
            gemini_prompt = f"""
            Generate a cooking recipe using:
            - Ingredients: {ingredients or 'Detect from image'}
            - Meal Type: {meal_type or "Any"}
            - Cuisine: {cuisine or "Any"}
            - Cooking Time: {cooking_time or "Flexible"}
            - Complexity: {complexity or "Any"}

            Return the recipe with a title, ingredients list, and step-by-step instructions.
            """

            if image:
                # Convert uploaded image to OpenCV format
                pil_image = Image.open(io.BytesIO(image.read())).convert("RGB")
                open_cv_image = np.array(pil_image)
                open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2BGR)

                # (Optional) Apply preprocessing here
                # Example: blur = cv2.GaussianBlur(open_cv_image, (5, 5), 0)

                # Convert back to PIL for Gemini
                image = Image.fromarray(cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2RGB))

                response = gemini_model.generate_content([gemini_prompt, image])
            else:
                response = gemini_model.generate_content(gemini_prompt)

            recipe = response.text

        else:
            # Hugging Face: text only
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
