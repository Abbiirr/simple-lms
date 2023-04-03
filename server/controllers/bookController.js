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

// Borrow Book
const borrowBook = async (req, res, next) => {
  try {
    const { book_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");

    const user_id = decode.id;

    // Check if book exists and is available
    const [bookRows] = await db
      .promise()
      .query(`SELECT * FROM books WHERE id = ? AND status = ?`, [
        book_id,
        "available",
      ]);
    if (bookRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Book not found or not available",
      });
    }

    // Create borrow record
    const [borrowRows] = await db
      .promise()
      .query(
        `INSERT INTO borrows (book_id, user_id, borrowed_date) VALUES (?, ?, ?)`,
        [book_id, user_id, new Date()]
      );

    // Update book status to borrowed
    await db
      .promise()
      .query(`UPDATE books SET status = ? WHERE id = ?`, ["borrowed", book_id]);

    res.status(200).json({
      status: true,
      message: "Book borrowed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Return Book
const returnBook = async (req, res, next) => {
  try {
    const { book_id } = req.body;
    const user_id = req.user.id;
    // Check if user has borrowed the book
    const [borrowRows] = await db
      .promise()
      .query(
        `SELECT * FROM borrows WHERE book_id = ? AND user_id = ? AND returned_date IS NULL`,
        [book_id, user_id]
      );
    if (borrowRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "You have not borrowed this book",
      });
    }

    // Update borrow record with return date
    const borrowId = borrowRows[0].id;
    await db
      .promise()
      .query(`UPDATE borrows SET returned_date = ? WHERE id = ?`, [
        new Date(),
        borrowId,
      ]);

    // Update book status to available
    await db
      .promise()
      .query(`UPDATE books SET status = ? WHERE id = ?`, [
        "available",
        book_id,
      ]);

    res.status(200).json({
      status: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export default { getBooks, addBook, searchBooks, borrowBook, returnBook };
