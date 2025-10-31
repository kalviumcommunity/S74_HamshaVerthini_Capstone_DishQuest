const Recipe = require("../models/recipe");


const createRecipe = async (req, res) => {
  try {
    console.log("📩 Incoming data:", req.body);
    console.log("📸 Uploaded file:", req.file);

    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const recipe = new Recipe({
      ...req.body,
      image: imagePath,
      createdBy: req.user?._id || "anonymous",
    });

    await recipe.save();

    console.log("✅ Recipe saved:", recipe);
    res.status(201).json(recipe);
  } catch (err) {
    console.error("❌ Error saving recipe:", err);
    res.status(500).json({ error: err.message });
  }
};



// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email");
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById };
