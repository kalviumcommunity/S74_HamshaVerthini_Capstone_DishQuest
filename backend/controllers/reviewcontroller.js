const Review = require("../models/review");

const addReview = async (req, res) => {
  try {
    const review = new Review({ ...req.body, userId: req.user });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviewsForRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addReview, getReviewsForRecipe };
