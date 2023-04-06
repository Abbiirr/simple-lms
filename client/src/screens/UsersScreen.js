import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      console.log(response.data.usernames);
      setUsers(response.data.usernames);
    } catch (error) {
      console.error(error);
    }
  };
  const checkIfLibrarian = (token) => {
    if (!token) return false;
    const decode = jwt_decode(token);
    const role = decode.role;
    if (role === "Librarian") return true;
    return false;
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="temp-header">
          <h1 className="my-3">Users</h1>
        </div>
        {users.map((user) => (
          <div key={user.id} className="col-lg-4 col-md-6 mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>Role: {user.role}</ListGroupItem>
                <ListGroupItem>Status: {user.status}</ListGroupItem>
              </ListGroup>
              {checkIfLibrarian(token) ? (
                <Card.Footer className="text-center">
                  <Button variant="secondary" href={`/edituser/${user.id}`}>
                    Edit User
                  </Button>
                </Card.Footer>
              ) : null}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersScreen;
