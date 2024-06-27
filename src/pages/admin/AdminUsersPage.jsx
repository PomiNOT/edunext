import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { useState, useEffect, createContext, useContext } from "react";
import { Col, Row, Table, Button, Form, Modal } from "react-bootstrap";
import * as auth from "../../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faPencil, faAdd } from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import { DomainError } from "../../services/errors";

const UsersManagementContext = createContext();

const headers = [
  { title: "Username", prop: "username", isFiterable: true, isSortable: true },
  { title: "Role", prop: "role", isFilterable: true, isSortable: true },
  {
    title: "Actions",
    prop: "id",
    isSortable: false,
    cellProps: { className: "w-12" },
    cell({ id }) {
      const { deleteUser } = useContext(UsersManagementContext);

      async function handleDelete() {
        try {
          if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
          }
        } catch (err) {
          if (err instanceof DomainError) {
            alert(err.message);
            return;
          } else {
            throw err;
          }
        }
      }

      return (
        <div className="space-x-2 flex justify-end">
          <Button variant="danger" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant="warning">
            <FontAwesomeIcon icon={faPencil} />
          </Button>
        </div>
      );
    },
  },
];

function AddUserDialog({ onDone, show }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [validated, setValidated] = useState(false);
  const { registerUser } = useContext(UsersManagementContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      await registerUser({ username, password, role });
    } catch (err) {
      if (err instanceof DomainError) {
        alert(err.message);
        return;
      } else {
        throw err;
      }
    }

    onDone();
  };

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faAdd} className="mr-2" />
          Add User
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={onSubmit} validated={validated} className="space-y-4">
      <Modal.Body>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
            <Form.Control.Feedback type="invalid">
              Username must be entered
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              minLength={8}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password must be at least 8 characters
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </Form.Select>
          </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onDone()}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
  );
}

function Wrapper({ children }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    auth.getAll().then(setUsers);
  }, []);

  async function registerUser(user) {
    if (!user) {
      return;
    }

    const newUser = await auth.register(user.username, user.password, user.role);
    setUsers([...users, newUser]);
  }

  async function deleteUser(id) {
    await auth.deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  }

  return <UsersManagementContext.Provider value={{ users, registerUser, deleteUser }}>
    {children}
  </UsersManagementContext.Provider>;
}

function UsersTable() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const { users } = useContext(UsersManagementContext);

  return (
    <>
      {showAddUserDialog && (
        <AddUserDialog show={showAddUserDialog} onDone={() => setShowAddUserDialog(false)} />
      )}

      <DatatableWrapper
        body={users}
        headers={headers}
        paginationOptionsProps={{
          initialState: {
            rowsPerPage: 10,
            options: [5, 10, 20, 50],
          },
        }}
      >
        <Card className="shadow min-h-[700px] max-h-[700px]">
          <Card.Header>
            <h1 className="font-bold text-2xl">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Manage Users
            </h1>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4 align-items-end">
              <Col xs={5}>
                <Filter />
              </Col>
              <Col xs={5}>
                <PaginationOptions />
              </Col>
              <Col xs={2}>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowAddUserDialog(true)}
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add User
                </Button>
              </Col>
            </Row>
            <Table striped hover>
              <TableHeader />
              <TableBody />
            </Table>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-center">
            <Pagination />
          </Card.Footer>
        </Card>
      </DatatableWrapper>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <Wrapper>
      <UsersTable />
    </Wrapper>
  );
}
