const Review = require("../models/review");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const addReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;

    if (!recipeId || !rating || !comment) {
      return res.status(400).json({ message: "Recipe ID, rating, and comment are required" });
    }

    let userName = "Anonymous Cook";
    let userAvatar = "";
    if (req.user) {
      const user = await User.findById(req.user);
      if (user) {
        userName = user.fullName || user.username;
        userAvatar = user.avatar || "";
      }
    }

    const review = new Review({
      recipeId,
      userId: req.user,
      userName,
      userAvatar,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate average rating for the recipe
    const reviews = await Review.find({ recipeId });
    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

    await Recipe.findByIdAndUpdate(recipeId, {
      rating: Number(avgRating),
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: err.message });
  }
};

const getReviewsForRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId })
      .populate("userId", "username fullName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addReview, getReviewsForRecipe };
