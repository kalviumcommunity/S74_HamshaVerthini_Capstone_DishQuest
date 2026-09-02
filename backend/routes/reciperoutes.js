const express = require("express");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
  toggleSaveRecipe,
} = require("../controllers/recipecontroller");

const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, upload.single("image"), createRecipe);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/save", protect, toggleSaveRecipe);

module.exports = router;
