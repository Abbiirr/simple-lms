const books = require("./../models/books");
const bookModel = require("./../models/books");

const addBook = (req, res) => {
  res.render("addBooks");
};

const postBook = (req, res) => {
  const data = new bookModel({
    name: req.body.name,
    author: req.body.author,
    genre: req.body.genre,
  });
  data
    .save()
    .then(() => {
      console.log("Book Added!");
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      res.redirect("/book-list");
    });
};

const getBookList = (req, res) => {
  var books = [];
  var MongoClient = require("mongodb").MongoClient;
  var url = process.env.DATABASE_URL;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    bookslists = [];
    books = dbo
      .collection("books")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        // books.push(result);
        // console.log(result);
        db.close();
      });
    // var bookslists = dbo.collection("books").find({});
  });
  // console.log(books);

  // console.log(bookslists);
  res.render("bookList", { books: books });
};

const getBooksFromDB = () => {
  var books = [];
  var MongoClient = require("mongodb").MongoClient;
  var url = process.env.DATABASE_URL;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    dbo
      .collection("books")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        books.push(result);
        // console.log(result);
        // db.close();
      });
  });
  return books;
};

module.exports = { addBook, getBookList, postBook, getBooksFromDB };
