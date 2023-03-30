import express from "express";

import dotenv from "dotenv";
import { connectDB, db } from "./config/db.js";
import path from "path";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config({ path: path.resolve("../.env") });

connectDB();

const app = express();
app.use(express.json());

app.get("/api/get", (req, res) => {
  console.log("Hello");
  const sql = "SELECT * FROM books";
  db.query(sql, (err, result) => {
    res.send(result);
    if (err) console.log(err);
  });
});

app.post("/api/insert", (req, res) => {
  const name = req.body.name;
  const author = req.body.author;
  const short_description = req.body.short_description;
  const genre = req.body.genre;
  const status = req.body.status;
  const borrow_history = req.body.borrow_history;

  const sql =
    "INSERT INTO books (name, author, short_description, genre, status, borrow_history) VALUES(?,?,?,?,?,?)";
  db.query(
    sql,
    [name, author, short_description, genre, status, borrow_history],
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log(result);
        res.sendStatus(200);
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(notFound);

app.use(errorHandler);

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.SERVER_PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
