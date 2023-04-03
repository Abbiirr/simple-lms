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
    const { email, password, role } = req.body;

    // Doctor Check
    if (role === "doctor") {
      // Account find using email
      isDoctor = true;

      let account = await Doctor.findOne({ email }).exec();

      // Compare with password
      if (account) {
        const result = await bcrypt.compare(password, account.password);
        if (result) {
          // Generate JWT token
          const token = await jwt.sign(
            { id: account._id, name: account.name, role: account.role },
            "SECRET",
            { expiresIn: "365d" }
          );

          // Update JWT token
          const updateToken = await Doctor.findOneAndUpdate(
            { _id: account._id },
            { $set: { access_token: token, status: "online" } },
            { new: true }
          ).exec();

          //---email verification start---

          // if (!account.verified) {
          //   let token = await Token.findOne({ userId: account._id });
          //   if (!token) {
          //     token = await new Token({
          //       userId: account._id,
          //       token: crypto.randomBytes(32).toString("hex"),
          //     }).save();
          //     const url = `http://localhost:4000/users/${account.id}/verify/${token.token}`;
          //     await sendEmail(account.email, "Verify Email", url);
          //   }

          //   return res
          //     .status(400)
          //     .send({ message: "An Email sent to your account please verify" });
          // }

          //---email verification end

          if (updateToken) {
            return res.status(200).json({
              status: true,
              token,
            });
          }

          //const emailtoken = account.generateAuthToken();
          res
            .status(200)
            .send({ data: token, message: "logged in successfully" });
        }

        return res.status(404).json({
          status: false,
          message: "Invalid e-mail or password",
        });
      }
    }

    // Patient Check
    if (role === "patient") {
      isDoctor = false;
      // Account find using email
      let account = await Patient.findOne({ email }).exec();

      // Compare with password
      if (account) {
        const result = await bcrypt.compare(password, account.password);
        if (result) {
          // Generate JWT token
          const token = await jwt.sign(
            { id: account._id, name: account.name, role: account.role },
            "SECRET",
            { expiresIn: "365d" }
          );

          // Update JWT token
          const updateToken = await Patient.findOneAndUpdate(
            { _id: account._id },
            { $set: { access_token: token, status: "online" } },
            { new: true }
          ).exec();

          //---email verification start---

          // if (!account.verified) {
          //   let token = await Token.findOne({ userId: account._id });
          //   if (!token) {
          //     token = await new Token({
          //       userId: account._id,
          //       token: crypto.randomBytes(32).toString("hex"),
          //     }).save();
          //     const url = `http://localhost:3000/users/${account._id}/verify/${token.token}`;
          //     await sendEmail(account.email, "Verify Email", url);
          //   }

          //   return res
          //     .status(400)
          //     .send({ message: "An Email sent to your account please verify" });
          // }

          //---email verification end

          if (updateToken) {
            return res.status(200).json({
              status: true,
              token,
            });
          }

          //const emailtoken = account.generateAuthToken();
          res
            .status(200)
            .send({ data: token, message: "logged in successfully" });
        }
        res.status(404).json({
          status: false,
          message: "Invalid e-mail or password",
        });
      }
    }

    if (role === "admin") {
      // Account find using email
      isDoctor = true;

      let account = await Admin.findOne({ email }).exec();

      // Compare with password
      if (account) {
        const result = await bcrypt.compare(password, account.password);
        if (result) {
          // Generate JWT token
          const token = await jwt.sign(
            { id: account._id, name: account.name, role: account.role },
            "SECRET",
            { expiresIn: "365d" }
          );

          // Update JWT token
          const updateToken = await Admin.findOneAndUpdate(
            { _id: account._id },
            { $set: { access_token: token, status: "online" } },
            { new: true }
          ).exec();

          //---email verification start---

          // if (!account.verified) {
          //   let token = await Token.findOne({ userId: account._id });
          //   if (!token) {
          //     token = await new Token({
          //       userId: account._id,
          //       token: crypto.randomBytes(32).toString("hex"),
          //     }).save();
          //     const url = `http://localhost:4000/users/${account.id}/verify/${token.token}`;
          //     await sendEmail(account.email, "Verify Email", url);
          //   }

          //   return res
          //     .status(400)
          //     .send({ message: "An Email sent to your account please verify" });
          // }

          //---email verification end

          if (updateToken) {
            return res.status(200).json({
              status: true,
              token,
            });
          }

          //const emailtoken = account.generateAuthToken();
          res
            .status(200)
            .send({ data: token, message: "logged in successfully" });
        }

        return res.status(404).json({
          status: false,
          message: "Invalid e-mail or password",
        });
      }
    }
  } catch (error) {
    if (error) next(error);
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

// Logout
const Logout = async (req, res, next) => {
  try {
    // Split token
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "SECRET");

    // Doctor Logout
    if (decode.role === "doctor") {
      isDoctor = true;
      // Find account using account id and role
      let account = await Doctor.findOne({
        $and: [{ _id: decode.id }, { role: decode.role }],
      });
      if (!account) {
        return res.status(404).json({
          status: false,
          message: "Invalid token",
        });
      }

      // Find account and null token field
      const updateToken = await Doctor.findByIdAndUpdate(
        { _id: decode.id },
        { $set: { access_token: null, status: "offline" } }
      );
      if (!updateToken) {
        return res.status(404).json({
          status: false,
          message: "Invalid token",
        });
      }

      res.status(200).json({
        status: true,
        message: "Successfully logged out",
      });
    }

    // Patient Logout
    if (decode.role === "patient") {
      isDoctor = false;
      // Find account using account id and role
      let account = await Patient.findOne({
        $and: [{ _id: decode.id }, { role: decode.role }],
      });
      if (!account) {
        return res.status(404).json({
          status: false,
          message: "Invalid token",
        });
      }

      // Find account and null token field
      const updateToken = await Patient.findByIdAndUpdate(
        { _id: decode.id },
        { $set: { access_token: null, status: "offline" } }
      );
      if (!updateToken) {
        return res.status(404).json({
          status: false,
          message: "Invalid token",
        });
      }

      res.status(200).json({
        status: true,
        message: "Successfully logged out",
      });
    }
  } catch (error) {
    if (error) {
      res.status(501).json({
        status: false,
        message: error.message,
      });
    }
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
