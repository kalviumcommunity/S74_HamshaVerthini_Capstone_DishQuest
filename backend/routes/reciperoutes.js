const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe'); // Capitalized to indicate it's a model

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // ✅ use different variable name
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// // POST a new recipe
// router.post('/add', async (req, res) => {
//     const { name, chef_name, cooking_time } = req.body;

//     const newRecipe = new Recipe({
//         name,
//         chef_name,
//         cooking_time
//     });

//     try {
//         const savedRecipe = await newRecipe.save();
//         res.status(201).json(savedRecipe);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

module.exports = router;
