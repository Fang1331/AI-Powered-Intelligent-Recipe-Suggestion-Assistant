import React, { useState } from "react";
import "./App.css";

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");
  const [model, setModel] = useState("gemini");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("ingredients", ingredients);
    formData.append("mealType", mealType);
    formData.append("cuisine", cuisine);
    formData.append("cookingTime", cookingTime);
    formData.append("complexity", complexity);
    formData.append("use", model);

    if (model === "gemini" && image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Recipe Generator</div>

        {/* Ingredients */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Conditional fields for Gemini */}
        {model === "gemini" && (
          <>
            {/* Meal Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Meal Type</label>
              <select
                className="block w-full bg-white border border-gray-400 px-4 py-2 rounded shadow"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            {/* Cuisine */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Cuisine Preference</label>
              <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                type="text"
                placeholder="e.g., Italian, Indian"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>

            {/* Cooking Time */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Cooking Time</label>
              <select
                className="block w-full bg-white border border-gray-400 px-4 py-2 rounded shadow"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30-60 minutes">30-60 minutes</option>
                <option value="More than 1 hour">More than 1 hour</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </>
        )}

        {/* Complexity */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Complexity</label>
          <select
            className="block w-full bg-white border border-gray-400 px-4 py-2 rounded shadow"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* AI Model Selector */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Choose AI Model</label>
          <select
            className="block w-full bg-white border border-gray-400 px-4 py-2 rounded shadow"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gemini">Gemini (Text + Image)</option>
            <option value="huggingface">Hugging Face (Text only)</option>
          </select>
        </div>

        {/* Submit */}
        <div className="px-6 py-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [recipeText, setRecipeText] = useState("");

  const onSubmit = async (formData) => {
    setRecipeText("Generating recipe...");
    try {
      const response = await fetch("http://localhost:5000/generate_recipe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setRecipeText(result.recipe || "No recipe generated.");
    } catch (error) {
      console.error("Error:", error);
      setRecipeText("Error generating recipe.");
    }
  };

  return (
    <div className="App">
      <div className="flex flex-row h-full my-4 gap-2 justify-center">
        <RecipeCard onSubmit={onSubmit} />
        <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shadow-xl whitespace-pre-line overflow-y-auto">
          {recipeText}
        </div>
      </div>
    </div>
  );
}

export default App;
