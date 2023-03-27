const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "movie",
});

db.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// app.get("/",(req, res)=>{
//     const sqlInsert = "INSERT INTO movie_review (movieName, movieReview) VALUES('Titanic','Awesome movie');"
//     db.query(sqlInsert, (err, result)=> {
//         console.log(err);
//         console.log(result);
//         res.send("Hello N!");
//     })
// })

app.get("/api/get", (req, res) => {
  console.log("Hello");
  const sql = "SELECT * FROM books";
  db.query(sql, (err, result) => {
    res.send(result);
    if (err) console.log(err);
  });
});

app.post("/api/insert", (req, res) => {
  const name = req.body.Name;
  const author = req.body.author;
  const genre = req.body.genre;

  const sql = "INSERT INTO books (Name, Author, Genre) VALUES(?,?,?)";
  db.query(sql, [name, author, genre], (err, result) => {
    console.log(result);

    if (err) console.log(err);
  });
});

// app.get("/",(req, res)=>{
//     res.send("Hello world!");
// })

app.listen(3001, () => {
  console.log("server running on port 3001");
});
