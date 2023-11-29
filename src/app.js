const express = require("express");
const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");
const usersControllers = require("./controllers/usersControllers");
const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");
app.get("/api/movies", movieControllers.getMovies);
app.post("/api/movies", validateMovie, movieControllers.postMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.put("/api/movies/:id", validateMovie, movieControllers.updateMovies);
app.delete("/api/movies/:id", movieControllers.deleteMovie);

app.get("/api/users", usersControllers.getUsers);
app.post("/api/users", validateUser, usersControllers.postUsers);
app.get("/api/users/:id", usersControllers.getUsersById);
app.put("/api/users/:id", validateUser, usersControllers.updateUsers);
app.delete("/api/users/:id", usersControllers.deleteUser);

module.exports = app;
