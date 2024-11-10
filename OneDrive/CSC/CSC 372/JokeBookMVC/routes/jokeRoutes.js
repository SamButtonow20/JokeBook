const express = require("express");
const router = express.Router();
const jokesController = require("../controllers/jokes.controller");
const jokeModel = require('../models/jokeModel');

// GET /jokebook/jokes - Get all jokes
router.get("/jokes", jokesController.getAll);  // Add this line

// GET /jokebook/categories - Get all categories
router.get("/categories", jokesController.getAll);

// Route for the main index page
router.get('/jokebook/index', async (req, res) => {
    try {
        const categories = await jokeModel.getCategories();  // Fetch categories
        console.log("Categories retrieved for index:", categories);  // Debugging log
        res.render('index', { categories });  // Pass categories to the view
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/jokebook/new-joke', async (req, res) => {
    try {
      const categories = await jokeModel.getCategories();
      console.log("Categories retrieved for new-joke:", categories);
  
      res.render('new-joke', { categories });
    } catch (err) {
      console.error("Error fetching categories in route:", err); // Log the error for debugging
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  
  


// Handle form submission for creating a new joke
router.post('/new-joke', async (req, res) => {  // Use router.post() here
    const { category, setup, delivery } = req.body; // Ensure these are coming from the form
  
    // Check if the category is missing
    if (!category) {
      return res.status(400).send('Invalid Request: Category is required');
    }
  
    try {
      // Add the new joke using the jokeModel
      const newJoke = await jokeModel.addJoke({ category, setup, delivery });
      console.log("New joke added:", newJoke);
  
      // Redirect the user to a page, like a category page, or confirmation page
      res.redirect(`/jokebook/category/${category}`);  // Example: Redirect to category page
    } catch (error) {
      console.error("Error adding new joke:", error);
      res.status(500).send("Error adding joke.");
    }
});

module.exports = router;
