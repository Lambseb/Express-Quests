const express = require("express");

const app = express();
app.use(express.json());
const movieControllers = require("./controllers/movieControllers");
const usersControllers = require("./controllers/usersControllers");
//GET
app.get("/api/movies", movieControllers.getMovies);
app.post("/api/movies", movieControllers.postMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", usersControllers.getUsers);
app.get("/api/users", usersControllers.getUsers);
app.post("/api/users", usersControllers.postUsers);
app.get("/api/users/:id", usersControllers.getUsersById);
//POST
module.exports = app;
