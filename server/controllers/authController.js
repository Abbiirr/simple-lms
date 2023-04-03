import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { Token } from "../models/Token.js";

// const Token = require("../../../models/Token");
// const sendEmail = require("../../utils/sendEmail");

let isDoctor = false;

// Register Account
const Register = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if the username already exists in the database
    db.query(
      "SELECT * FROM users WHERE username = ?",
      username,
      async (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(208).json({
            status: false,
            message: "This username already exists.",
          });
        }

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10);

        // Insert a new row into the 'users' table
        db.query(
          "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
          [username, hashPassword, email, role],
          (error, results, fields) => {
            if (error) throw error;

            return res.status(201).json({
              status: true,
              message: "Successfully account created",
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Login Account
const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const [rows, fields] = await db
      .promise()
      .query(`SELECT * FROM users WHERE username = ?`, [username]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Invalid username or password",
      });
    }

    const account = rows[0];

    const result = await bcrypt.compare(password, account.password);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { id: account.id, username: username, role: account.role },
      "SECRET",
      { expiresIn: "365d" }
    );

    await db
      .promise()
      .query(`UPDATE users SET access_token = ?, status = ? WHERE id = ?`, [
        token,
        "online",
        account.id,
      ]);

    res.status(200).json({
      status: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Reset Password
const Reset = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log({ email, password });
  } catch (error) {
    if (error) next(error);
  }
};

// Logout Account
const Logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await db
      .promise()
      .query(`UPDATE users SET access_token = NULL, status = ? WHERE id = ?`, [
        "offline",
        userId,
      ]);

    res.status(200).json({
      status: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const verifyToken = async (req, res) => {
  if (isDoctor) {
    try {
      const doctor = await Doctor.findOne({ _id: req.params.id });
      if (!doctor) return res.status(400).send({ message: "Invalid link" });

      const token = await Token.findOne({
        doctorId: doctor._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send({ message: "Invalid link" });

      await Doctor.updateOne({ _id: doctor._id, verified: true });
      await token.remove();

      res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  } else {
    try {
      const patient = await Patient.findOne({ _id: req.params.id });
      if (!patient) return res.status(400).send({ message: "Invalid link" });

      const token = await Token.findOne({
        patientId: patient._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send({ message: "Invalid link" });

      await Patient.updateOne({ _id: patient._id, verified: true });
      await token.remove();

      res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

export default { Register, Login, Reset, Logout, verifyToken };
