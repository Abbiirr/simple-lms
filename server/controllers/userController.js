import { db } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");
    const { id } = req.params;
    const { email } = req.body;

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

    await db
      .promise()
      .query(`UPDATE users SET email = ? WHERE id = ?`, [email, id]);

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

const addUser = async (req, res, next) => {
  try {
    // Check if current user has permission to add a user
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");
    if (decode.role !== "Librarian") {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    // Extract user data from request body
    const { username, password, email, role } = req.body;

    // Check if username already exists in the database
    const [rows, fields] = await db
      .promise()
      .query(`SELECT * FROM users WHERE username = ?`, [username]);
    if (rows.length !== 0) {
      return res.status(400).json({
        status: false,
        message: "Username already exists",
      });
    }

    // Hash password and insert new user into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        `INSERT INTO users (username, password, email,role) VALUES (?, ?,?, ?)`,
        [username, hashedPassword, email, role]
      );

    res.status(200).json({
      status: true,
      message: "User added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export default { getUsers, deleteUser, editUser, addUser };
