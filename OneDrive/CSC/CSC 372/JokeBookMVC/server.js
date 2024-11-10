"use strict";
const express = require("express");
const app = express();
const { getJokesByCategory, addJoke } = require('./models/jokeModel');
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import the joke model
const jokeModel = require("./models/jokeModel"); 
const { db_close } = require("./models/database");

app.use(express.static(__dirname + "/public"));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Redirect root URL to /jokebook/index
app.get('/', (req, res) => {
  res.redirect('/jokebook/index');
});

// Use the routes for /jokebook
app.use("/jokebook", require("./routes/jokeRoutes"));

// Route for the main index page
app.get('/jokebook/index', async (req, res) => {
  try {
    const categories = await jokeModel.getCategories();
    console.log("Categories retrieved for index:", categories);
    res.render('index', { categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create a new joke (GET to show the form)
app.get('/jokebook/new-joke', (req, res) => {
  res.render('new-joke'); // Render the Pug template for creating a new joke
});

// Route to handle the form submission (POST)
app.post('/jokebook/new-joke', async (req, res) => {
  const { category, setup, delivery } = req.body;

  // Validate the inputs
  if (!category || !setup || !delivery) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Add the new joke to the database
    const newJoke = await jokeModel.addJoke({ category, setup, delivery });

    // Redirect to the jokebook (or wherever you want to go after adding the joke)
    res.redirect('/jokebook'); // Assuming you have a jokebook page to list all jokes
  } catch (error) {
    console.error('Error adding joke:', error);
    res.status(500).send('Failed to add the joke');
  }
});

// Route to fetch jokes by category
app.get('/jokes/:category', async (req, res) => {
  const categoryName = req.params.category;

  try {
    const jokes = await getJokesByCategory(categoryName);
    console.log("Fetched jokes:", jokes);
    res.render('jokes', { jokes, categoryName });
  } catch (error) {
    console.error("Error fetching jokes:", error);
    res.status(500).send("Error retrieving jokes.");
  }
});

// Handle graceful shutdown
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("App listening at http://localhost:" + PORT);
});

process.on("SIGINT", cleanUp);

function cleanUp() {
  console.log("Terminate signal received.");
  db_close();
  console.log("...Closing HTTP server.");
  server.close(() => {
    console.log("...HTTP server closed.");
  });
}
