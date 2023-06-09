import express from "express";

import dotenv from "dotenv";
import { connectDB, db } from "./config/db.js";
import path from "path";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userReportsRoutes from "./routes/userReportsRoutes.js";

dotenv.config({ path: path.resolve("../.env") });

connectDB();

const app = express();
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user-reports", userReportsRoutes);
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

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
