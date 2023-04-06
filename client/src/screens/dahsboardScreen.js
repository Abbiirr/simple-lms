import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";

const DashboardScreen = () => {
  const [bookCount, setBookCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [fineTotal, setFineTotal] = useState(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await axios.get("/api/books");
        console.log(response.data.books.length);
        setBookCount(response.data.books.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBorrowedCount = async () => {
      try {
        const response = await axios.get("/api/reports/borrowed");
        console.log(response.data.books.length);
        setBorrowedCount(response.data.books.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOverdueCount = async () => {
      try {
        const response = await axios.get("/api/reports/overdue");
        console.log("Overdue: " + response.data.books.length);
        setOverdueCount(response.data.books.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFineTotal = async () => {
      try {
        const response = await axios.get("/api/fines/total");
        setFineTotal(response.data.total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookCount();
    fetchBorrowedCount();
    fetchOverdueCount();
    fetchFineTotal();
  }, []);

  return (
    <div className="container">
      <h1 className="my-3">Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Books</Card.Title>
              <Card.Text>{bookCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Borrowed</Card.Title>
              <Card.Text>{borrowedCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Overdue</Card.Title>
              <Card.Text>{overdueCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Fines</Card.Title>
              <Card.Text>{fineTotal}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardScreen;
