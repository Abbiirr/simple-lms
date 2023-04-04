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

export default { getAllBorrowedBooks, getAllAvailableBooks };
