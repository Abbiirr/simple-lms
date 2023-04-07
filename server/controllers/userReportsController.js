import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const getDueBooks = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");
    if (decode.role !== "Librarian") {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    const { user_id } = req.body;
    // Get all borrowed books that are due
    const [rows] = await db
      .promise()
      .query(
        `SELECT books.name, books.id, borrow.due_date FROM borrow JOIN books ON borrow.bookID = books.id WHERE borrow.userId = ? AND borrow.returned_date IS NULL`,
        [user_id, new Date()]
      );

    res.status(200).json({
      status: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export default { getDueBooks };
