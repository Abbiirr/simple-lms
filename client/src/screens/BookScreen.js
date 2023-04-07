import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
// import "./templatesscreen.css";
import jwt_decode from "jwt-decode";

const BookScreen = () => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  const checkIfLibrarian = (token) => {
    if (!token) return false;
    const decode = jwt_decode(token);
    const role = decode.role;
    if (role === "Librarian") return true;
    return false;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/books");
        console.log(response.data);
        setBooks(response.data.books);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container">
      {books.length === 0 ? (
        <div className="loader">
          <h4>Loading books...</h4>
        </div>
      ) : (
        <div className="row">
          <div className="temp-header">
            <h1 className="my-3">Books</h1>
          </div>
          {books.map((book) => (
            <div key={book._id} className="col-lg-4 col-md-6 mb-4">
              <Card className="h-100">
                {/* <Card.Img variant="top" src={book.thumbnail} /> */}
                <Card.Body>
                  {/* <Card.Title>{book._id}</Card.Title> */}
                  <Card.Text>{book.name}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>Author: {book.author}</ListGroupItem>
                  <ListGroupItem>Genre: {book.genre}</ListGroupItem>
                  <ListGroupItem>Status: {book.status}</ListGroupItem>
                  <ListGroupItem>
                    Description: {book.short_description}
                  </ListGroupItem>
                </ListGroup>
                <Card.Footer className="text-center">
                  <Link
                    to={`/viewbook/${book._id}`}
                    className="btn btn-primary mx-2"
                  >
                    View Book
                  </Link>

                  <Link
                    to={`/borrowbook/${book._id}`}
                    className="btn btn-success mx-2"
                  >
                    Borrow Book
                  </Link>
                  {checkIfLibrarian(token) ? (
                    <Link
                      to={`/editbook/${book._id}`}
                      className="btn btn-secondary mx-2"
                    >
                      Edit Book
                    </Link>
                  ) : null}
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookScreen;
