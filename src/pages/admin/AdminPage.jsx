import {
  DropdownButton,
  Dropdown,
  Nav,
  Navbar,
  Container,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContextComponent";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  const { logout, user } = useContext(UserContext);

  return (
    <>
      <Navbar bg="primary" expand="md">
        <Container>
          <Navbar.Brand as={Link} className="text-light" to="/admin">
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle
            data-bs-theme="dark"
            className="text-white"
            aria-controls="navbar"
          />
          <Navbar.Collapse id="navbar">
            <Nav>
              <Nav.Link as={Link} className="text-light" to="/admin/subjects">
                Subjects
              </Nav.Link>
              <Nav.Link as={Link} className="text-light" to="/admin/users">
                Users
              </Nav.Link>
              <Nav.Link as={Link} className="text-light" to="/admin/classes">
                Classes
              </Nav.Link>
            </Nav>
            <DropdownButton
              className="ms-auto"
              title={
                <span>
                  <FontAwesomeIcon icon={faUser} /> {user.username}
                </span>
              }
            >
              <Dropdown.Item className="text-danger" onClick={logout}>
                Logout
              </Dropdown.Item>
            </DropdownButton>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <Outlet />
      </Container>
    </>
  );
}
