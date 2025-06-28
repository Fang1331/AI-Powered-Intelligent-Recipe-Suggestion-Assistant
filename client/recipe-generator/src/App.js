import React, { useState } from "react";
import "./App.css";

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");
  const [model, setModel] = useState("gemini"); // Default model

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
      use: model
    };
    onSubmit(recipeData);
  };

  return (
    <div className="w-[400px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Recipe Generator</div>

        {/* Ingredients */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredients">
            Ingredients
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Only show these when Gemini is selected */}
        {model === "gemini" && (
          <>
            {/* Meal Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mealType">
                Meal Type
              </label>
              <select
                className="block appearance-none w-full bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
                id="mealType"
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuisine">
                Cuisine Preference
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
                id="cuisine"
                type="text"
                placeholder="e.g., Italian, Mexican"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>

            {/* Cooking Time */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cookingTime">
                Cooking Time
              </label>
              <select
                className="block appearance-none w-full bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
                id="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30-60 minutes">30-60 minutes</option>
                <option value="More than 1 hour">More than 1 hour</option>
              </select>
            </div>
          </>
        )}

        {/* Complexity */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
            Complexity
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
            id="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Model Selector */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
            Choose AI Model
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gemini">Gemini</option>
            <option value="huggingface">Hugging Face</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            type="button"
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

  const onSubmit = async (data) => {
    setRecipeText("Generating recipe...");
    try {
      const response = await fetch("http://localhost:5000/generate_recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setRecipeText(result.recipe || "No recipe generated.");
    } catch (error) {
      console.error("Error fetching recipe:", error);
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
