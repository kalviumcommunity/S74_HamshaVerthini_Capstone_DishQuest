const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, lowercase: true },
  cuisine: { type: String, required: true, lowercase: true },
  prepTime: { type: Number, default: 0 },
  cookTime: { type: Number, default: 0 },
  servings: { type: Number, default: 1 },
  difficulty: { type: String, default: "Medium" },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  notes: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName: { type: String, default: "Chef" },
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
