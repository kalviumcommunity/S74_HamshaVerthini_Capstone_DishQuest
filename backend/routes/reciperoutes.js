const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} = require("../controllers/recipecontroller"); // ✅ Ensure correct path and spelling

const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// ✅ Create Recipe (with image upload)
router.post("/", protect, upload.single("image"), createRecipe);

// ✅ Get All Recipes
router.get("/", getAllRecipes);

// ✅ Get Recipe by ID
router.get("/:id", getRecipeById);

module.exports = router;
