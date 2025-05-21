const Recipe = require("../models/recipe");

const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, createdBy: req.user });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username");
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById };
