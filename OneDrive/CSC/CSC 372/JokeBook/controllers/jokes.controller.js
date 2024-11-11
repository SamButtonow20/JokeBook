"use strict";
const model = require("../models/jokeModel");

// Get all categories
async function getAll(req, res, next) {
  try {
    let categories = await model.getCategories();  // Await to ensure the categories are fetched
    res.render("category", { categories: categories, title: "All Categories" });
  } catch (err) {
    console.error("Error while getting categories: ", err.message);
    next(err);  // Pass error to error handling middleware
  }
}

// Get jokes by category or random joke if none specified
async function getAllByOneAttribute(req, res, next) {
  const category = req.query.category || req.params.category;
  const limit = parseInt(req.query.limit) || 10;

  if (category) {
    try {
      let jokes = await model.getJokesByCategory(category, limit);  // Await the asynchronous call
      res.render("jokes", { jokes: jokes, title: category + " Jokes" });
    } catch (err) {
      console.error("Error while getting jokes by category: ", err.message);
      next(err);  // Pass error to error handling middleware
    }
  } else {
    res.status(400).send("Invalid Request: Category is required");
  }
}

// Get one joke by ID
async function getOneById(req, res, next) {
  try {
    let joke = await model.getJokeById(req.params.id);  // Await the asynchronous call
    res.render("joke-details", { joke: joke, title: 'Joke #' + req.params.id });
  } catch (err) {
    console.error("Error while getting joke: ", err.message);
    next(err);  // Pass error to error handling middleware
  }
}

async function createNew(req, res, next) {
  const { category, setup, delivery } = req.body;

  if (category && setup && delivery) {
    try {
      // Fetch category_id based on the category name
      const categoryId = await model.getCategoryIdByName(category);

      if (!categoryId) {
        // Category not found in the database
        return res.status(400).send("Invalid Request: Category not found.");
      }

      // Prepare parameters for the INSERT query
      const params = [categoryId, setup, delivery];

      // Insert the joke
      await model.addJoke(params);

      // Optionally, you can fetch updated data and redirect to the joke list page
      res.status(201).redirect("/jokes");  // Redirect to a page that lists all jokes after adding one
    } catch (err) {
      console.error("Error while adding joke: ", err.message);
      next(err); // Pass the error to error-handling middleware
    }
  } else {
    // Missing required fields
    res.status(400).send("Invalid Request: All fields (category, setup, delivery) are required.");
  }
}


module.exports = {
  getAll,
  getAllByOneAttribute,
  getOneById,
  createNew
};
