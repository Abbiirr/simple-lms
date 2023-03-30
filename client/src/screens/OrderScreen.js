import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
// import "./templatesscreen.css";

const OrderScreen = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/books");
        console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container">
      {/* {books.length === 0 ? (
        <div className="loader"><h4>Loading books...</h4></div> 
      ) : ( */}
      <div className="row">
        <div className="temp-header">
          <h1 className="my-3">Books</h1>
        </div>
        {books.map((book) => (
          <div key={book._id} className="body-style">
            <Card className="style-card">
              {/* <Card.Img variant="top" src={book.thumbnail} /> */}
              <Card.Body>
                {/* <Card.Title>{book._id}</Card.Title> */}
                <Card.Text>{book.name}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  <Link to={`/viewbook/${book._id}`}>
                    View Book: {book.name}
                  </Link>
                </ListGroupItem>
                <ListGroupItem>
                  <Link to={`/editbook/${book._id}`}>
                    Edit Book: {book.name}
                  </Link>
                </ListGroupItem>
                <ListGroupItem>
                  <Link to={`/borrowbook/${book._id}`}>
                    Borrow Book: {book.name}
                  </Link>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
};

export default OrderScreen;
