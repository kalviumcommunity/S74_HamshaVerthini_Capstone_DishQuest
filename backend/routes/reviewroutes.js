const express = require("express");
const { addReview, getReviewsForRecipe } = require("../controllers/reviewcontroller");
const protect = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/", protect, addReview);
router.get("/:recipeId", getReviewsForRecipe);

module.exports = router;
