"use strict";
const express = require("express");
const router = express.Router();

const jokeController = require("../controllers/jokes.controller");

//http://localhost:3000/jokes/all
router.get("/all", jokeController.getAll);

//http://localhost:3000/jokes?name=misc
router.get("/", jokeController.getAllByOneCategory);

// http://localhost:3000/random
router.get("/random", jokeController.getRandom);

//http://localhost:3000/jokes/new
router.get("/new", jokeController.createNew);

module.exports = router;