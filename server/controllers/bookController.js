import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

//get all books
const getBooks = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM books");
    res.status(200).json({
      status: true,
      books: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const addBook = async (req, res) => {
  try {
    const { name, author, short_description, genre, status } = req.body;
    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO books (name, author, short_description,genre, status) VALUES (?, ?, ?, ?, ?)",
        [name, author, short_description, genre, status]
      );
    res.status(200).json({
      status: true,
      message: "Book added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export default { addBook, searchBooks, getBooks };
