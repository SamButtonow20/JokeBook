"use strict";
const express = require("express");
const app = express();

const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const jokebookRoutes = require("./routes/jokes.route");
const { db_close } = require("./models/db-conn");

app.use(express.static(__dirname +"/public"));

app.set('view engine', 'pug');
app.set('views', __dirname +'/views');

app.use("/jokes", jokebookRoutes);

app.get("/", (req, res) => {
  res.redirect("/jokes/random");
});

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
    console.log("...HTTP server closed.")
  })
}
