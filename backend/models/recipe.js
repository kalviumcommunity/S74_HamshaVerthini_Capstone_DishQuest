const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipe_name: { type: String, required: true },
    chef_name: { type: String, required: true },
    cooking_time: { type: Number, required: true }
});

module.exports = mongoose.model('Recipe', recipeSchema);
