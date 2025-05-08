const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  cuisine: String,
  ingredients: [String],
  instructions: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
