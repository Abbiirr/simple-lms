import { db } from "../config/db.js";

const getAllBorrowedBooks = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM books WHERE status = 'borrowed'");
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

const getAllAvailableBooks = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM books WHERE status = 'available'");
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

const getOverdueBooks = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
    SELECT b.*, u.username AS user_name
    FROM borrow bor
    JOIN books b ON b.id = bor.bookID
    JOIN users u ON u.id = bor.userId
    WHERE bor.returned_date IS NULL 
      AND bor.due_date < CURDATE();
    
    `);
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

export default { getAllBorrowedBooks, getAllAvailableBooks, getOverdueBooks };
