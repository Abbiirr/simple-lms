import { db } from "../config/db.js";

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

export default { getUsers };
