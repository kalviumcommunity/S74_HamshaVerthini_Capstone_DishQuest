const express = require('express');
const router = express.Router();


const Recipe = require('../models/recipe'); 

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find(); 
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

    

// POST a new recipe
router.post('/add', async (req, res) => {
    const { recipe_name, chef_name, cooking_time } = req.body;

    const newRecipe = new Recipe({
        recipe_name,
        chef_name,
        cooking_time
    });

    try {
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

//PUT to update the recipe
router.put('/update/:id', async (req, res) => {
  const { recipe_name, chef_name, cooking_time } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { recipe_name, chef_name, cooking_time },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
