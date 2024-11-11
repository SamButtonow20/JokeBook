"use strict";

var model = require("../models/jokeModel")["default"];

function getAll(req, res, next) {
  try {
    var categories = model.getCategories(); // res.render("index", { categories: categories, title: "Categories" });

    res.json(categories);
  } catch (err) {
    console.error("Error while getting categories:", err.message);
    next(err); // Pass the error to the next middleware (e.g., error handler)
  }
}

function getAllByOneAttribute(req, res, next) {
  var category = req.query.category;
  var limit = parseInt(req.query.limit) || 10;

  if (category) {
    try {
      model.getJokesByCategory(category, limit, function (err, jokes) {
        if (err) throw new Error(err);
        res.render("jokes", {
          jokes: jokes,
          title: "".concat(category, " Jokes")
        });
      });
    } catch (err) {
      console.error("Error while getting jokes by category:", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Invalid Request: Category is required.");
  }
}

function getOneById(req, res, next) {
  var jokeId = req.params.id;

  try {
    model.getJokeById(jokeId, function (err, joke) {
      if (err) throw new Error(err);
      if (!joke) return res.status(404).send("Joke not found");
      res.render("joke-detail", {
        joke: joke,
        title: "Joke #".concat(jokeId)
      });
    });
  } catch (err) {
    console.error("Error while getting joke by ID:", err.message);
    next(err);
  }
}

function createNew(req, res, next) {
  var _req$body = req.body,
      category = _req$body.category,
      setup = _req$body.setup,
      delivery = _req$body.delivery;

  if (category && setup && delivery) {
    var params = [category, setup, delivery];

    try {
      model.addJoke(params, function (err, newJoke) {
        if (err) throw new Error(err);
        res.render("jokes", {
          jokes: [newJoke],
          title: "New Joke Added"
        });
      });
    } catch (err) {
      console.error("Error while adding joke:", err.message);
      next(err);
    }
  } else {
    res.status(400).send("Invalid Request: All fields (category, setup, delivery) are required.");
  }
}

module.exports = {
  getAll: getAll,
  getAllByOneAttribute: getAllByOneAttribute,
  getOneById: getOneById,
  createNew: createNew
};