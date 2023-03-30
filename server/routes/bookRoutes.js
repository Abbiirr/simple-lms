import express from "express";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

import { connectDB, db } from "../config/db.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  })
);

router.post(
  "/insert",
  asyncHandler(async (req, res) => {
    const name = req.body.name;
    const author = req.body.author;
    const short_description = req.body.short_description;
    const genre = req.body.genre;
    const status = req.body.status;

    const sql =
      "INSERT INTO books (name, author, short_description, genre, status) VALUES(?,?,?,?,?)";
    db.query(
      sql,
      [name, author, short_description, genre, status],
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
  })
);

router.get("/search", (req, res) => {
  const { query } = req.query;

  console.log(query);

  // Build the SQL query based on the search query and filter options
  let sql = `SELECT * FROM lms.books WHERE name LIKE '%${query}%' OR author LIKE '%${query}%' OR genre LIKE '%${query}%' OR short_description LIKE '%${query}%'`;

  if (req.query.author) {
    sql += ` AND author='${req.query.author}'`;
  }

  if (req.query.genre) {
    sql += ` AND genre='${req.query.genre}'`;
  }

  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

export default router;
