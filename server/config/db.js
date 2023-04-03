import mongoose from "mongoose";

import mysql from "mysql2";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.DATABASE_URL, {
//       useNewUrlParser: true,

//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: `);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     // throw err;
//   }
// };

export const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "abir",
  database: "lms",
});

export const connectDB = () => {
  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MySQL");
    }
  });
};

export default { connectDB, db };
