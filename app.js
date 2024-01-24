import express, { json } from "express";
import { moviesRouter } from "./routes/movies-routes.js";
import { middlewareCors } from "./middlewares/cors.js";

const app = express();

app.use(json());
app.use("/movies", moviesRouter);
app.use(middlewareCors());

app.disable("x-powered-by");

const PORT = process.env.PORT ?? 4321;

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
