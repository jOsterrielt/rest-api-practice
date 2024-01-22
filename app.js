const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const { validateMovie, validatepartialMovie } = require("./schema/movies");

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:4321",
        "https://movies.com",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.disable("x-powered-by");

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  let responseMovies = movies;
  if (genre) {
    responseMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }
  res.json(responseMovies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieFound = movies.find((movie) => movie.id === id);
  res.json(movieFound);
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    res.status(400).json({
      error: JSON.parse(result.error.message),
    });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = validatepartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    res.status(404).json({ message: "Movie Not Found" });
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updatedMovie;
  return res.json(updatedMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: "Movie deleted" });
});

const PORT = process.env.PORT ?? 4321;

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
