const Recipe = require("../models/recipe");
const User = require("../models/user");

const createRecipe = async (req, res) => {
  try {
    const { title, description, category, cuisine, prepTime, cookTime, servings, difficulty, ingredients, instructions, notes, imageUrl } = req.body;

    let imagePath = imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop";
    if (req.file) {
      imagePath = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Process ingredients & instructions (handle array or multiline string)
    let parsedIngredients = [];
    if (Array.isArray(ingredients)) {
      parsedIngredients = ingredients;
    } else if (typeof ingredients === "string") {
      parsedIngredients = ingredients.split("\n").map(i => i.trim()).filter(Boolean);
    }

    let parsedInstructions = [];
    if (Array.isArray(instructions)) {
      parsedInstructions = instructions;
    } else if (typeof instructions === "string") {
      parsedInstructions = instructions.split("\n").map(i => i.trim()).filter(Boolean);
    }

    let authorName = "Chef";
    if (req.user) {
      const user = await User.findById(req.user);
      if (user) authorName = user.fullName || user.username;
    }

    const recipe = new Recipe({
      title,
      description,
      category: category ? category.toLowerCase() : "dinner",
      cuisine: cuisine ? cuisine.toLowerCase() : "other",
      prepTime: Number(prepTime) || 15,
      cookTime: Number(cookTime) || 20,
      servings: Number(servings) || 4,
      difficulty: difficulty || "Medium",
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      notes: notes || "",
      image: imagePath,
      createdBy: req.user || null,
      authorName: authorName,
      rating: 5.0,
      numReviews: 1,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all recipes with search & filters
const getAllRecipes = async (req, res) => {
  try {
    const { category, cuisine, difficulty, search, featured } = req.query;
    let query = {};

    if (category) query.category = category.toLowerCase();
    if (cuisine) query.cuisine = cuisine.toLowerCase();
    if (difficulty) query.difficulty = new RegExp(`^${difficulty}$`, "i");
    
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { cuisine: searchRegex },
        { category: searchRegex },
        { ingredients: searchRegex },
      ];
    }

    let recipes = await Recipe.find(query)
      .populate("createdBy", "username fullName avatar")
      .sort({ createdAt: -1 });

    if (featured === "true") {
      recipes = recipes.slice(0, 4);
    }

    res.status(200).json({ recipes, count: recipes.length });
  } catch (err) {
    console.error("Error getting recipes:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username fullName avatar");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy && recipe.createdBy.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Save / Bookmark recipe
const toggleSaveRecipe = async (req, res) => {
  try {
    const userId = req.user;
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    const recipe = await Recipe.findById(recipeId);

    if (!user || !recipe) {
      return res.status(404).json({ message: "User or Recipe not found" });
    }

    const isSaved = user.savedRecipes.includes(recipeId);

    if (isSaved) {
      user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
      recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== userId);
    } else {
      user.savedRecipes.push(recipeId);
      recipe.savedBy.push(userId);
    }

    await user.save();
    await recipe.save();

    res.status(200).json({
      isSaved: !isSaved,
      message: !isSaved ? "Recipe saved to bookmarks" : "Recipe removed from bookmarks",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById, deleteRecipe, toggleSaveRecipe };
