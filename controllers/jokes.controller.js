'use strict'
const model = require('../models/jokeModel')

// Get all categories
async function getAll (req, res, next) {
  try {
    let categories = model.getCategories()
    res.render('categories', {
      categories: categories,
      title: 'All Categories',
      page: `All Categories`
    })
    // res.json(categories);
  } catch (err) {
    console.error('Error while getting categories: ', err.message)
    next(err)
  }
}

function getRandom (req, res, next) {
  try {
    let jokes = model.getRandom();

    res.render('random', {
      jokes: jokes,
      title: 'Random Joke',
      page: 'Random Joke'
    });
    // res.json(jokes);
  } catch (error) {
    console.error('Error while getting a random joke: ', error.message);
    next(error)
  }
}

function getAllByOneCategory (req, res, next) {
  const name = req.query.name;
  try {
    let jokes = model.getAllByOneCategory(name);

    // res.json(jokes);
    res.render('jokes', {
      jokes: jokes,
      title: `Category: ${name}`,
      page: `Category: ${name}`
    });
  } catch (error) {
    console.error(
      'Error while getting all jokes by category name: ',
      error.message
    )
    next(error)
  }
}

function createNew (req, res, next) {
  const newJoke = {
    category: req.query.category,
    setup: req.query.setup,
    delivery: req.query.delivery
  };
  
  model.addNewJoke(newJoke);

  let jokes = model.getAllByOneCategory(newJoke.category);

    // res.json(jokes);
    res.render('jokes', {
      jokes: jokes,
      title: `Category: ${newJoke.category}`,
      page: `Category: ${newJoke.category}`
    });
}

module.exports = {
  getAll,
  getRandom,
  getAllByOneCategory,
  createNew
}
