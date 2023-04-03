import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const getUsers = async (req, res, next) => {
  try {
    const sql = "SELECT * FROM users";
    const [rows, fields] = await db.promise().query(sql);

    const usernames = rows.map((row) => row.username);

    res.status(200).json({
      status: true,
      usernames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");

    const { id } = req.params;

    const [rows, fields] = await db
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    if (decode.role !== "Librarian") {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    await db.promise().query(`DELETE FROM users WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const [rows, fields] = await db
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    if (req.user.role !== "Librarian") {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    await db
      .promise()
      .query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [
        name,
        email,
        id,
      ]);

    res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export default { getUsers, deleteUser, editUser };
