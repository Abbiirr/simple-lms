import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

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
    await db.promise().query(
      `INSERT INTO borrow (bookID, userId, start_date, due_date) VALUES (?, ?, ?, ?)`,
      [
        book_id,
        user_id,
        new Date(),
        new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
      ] // 14 days from today
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
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");

    const user_id = decode.id;

    // Check if user has borrowed the book
    const [borrowRows] = await db
      .promise()
      .query(
        `SELECT * FROM borrow WHERE bookID = ? AND userId = ? AND returned_date IS NULL`,
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
      .query(
        `UPDATE borrow SET returned_date = ? WHERE bookID = ? AND userId = ?`,
        [new Date(), book_id, user_id]
      );

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

export default { borrowBook, returnBook };
