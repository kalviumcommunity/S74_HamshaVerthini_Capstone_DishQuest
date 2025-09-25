const express = require("express");
const { createRecipe, getAllRecipes, getRecipeById } = require("../controllers/recipecontroller");
const protect = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

module.exports = router;
