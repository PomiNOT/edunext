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
import * as usersService from "../../services/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrash,
  faPencil,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import { DomainError } from "../../services/errors";

const UsersManagementContext = createContext();

const headers = [
  { title: "Username", prop: "username", isFilterable: true, isSortable: true },
  { title: "Role", prop: "role", isSortable: true },
  {
    title: "Actions",
    prop: "id",
    isSortable: false,
    cellProps: { className: "w-1 whitespace-nowrap" },
    cell(user) {
      const { deleteUser } = useContext(UsersManagementContext);
      const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(
        false
      );

      async function handleDelete() {
        try {
          if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUser(user.id);
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
        <>
          {showChangePasswordDialog && (
            <ChangePasswordDialog
              id={user.id}
              onDone={() => setShowChangePasswordDialog(false)}
              show={showChangePasswordDialog}
            />
          )}
          <div className="space-x-2">
            <Button variant="danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
            <Button variant="warning" onClick={() => setShowChangePasswordDialog(true)}>
              <FontAwesomeIcon icon={faPencil} /> Change Password
            </Button>
          </div>
        </>
      );
    },
  },
];

function ChangePasswordDialog({ id, onDone, show }) {
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const { changePassword } = useContext(UsersManagementContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      setLoading(true);
      await changePassword(id, password);
      onDone();
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
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onDone()}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Changing password..." : "Change Password"}
        </Button>
      </Modal.Footer>
      </Form>
    </Modal>
  )
}

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
      <Form
        noValidate
        onSubmit={onSubmit}
        validated={validated}
        className="space-y-4"
      >
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
            <Form.Select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onDone()}>
            Cancel
          </Button>
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
    usersService.getAll().then(setUsers);
  }, []);

  async function registerUser(user) {
    if (!user) {
      return;
    }

    const newUser = await usersService.register(
      user.username,
      user.password,
      user.role
    );
    setUsers([...users, newUser]);
  }

  async function deleteUser(id) {
    await usersService.deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  }

  async function changePassword(id, password) {
    await usersService.changePassword(id, password);
  }

  return (
    <UsersManagementContext.Provider
      value={{ users, registerUser, deleteUser, changePassword }}
    >
      {children}
    </UsersManagementContext.Provider>
  );
}

function UsersTable() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const { users } = useContext(UsersManagementContext);

  return (
    <>
      {showAddUserDialog && (
        <AddUserDialog
          show={showAddUserDialog}
          onDone={() => setShowAddUserDialog(false)}
        />
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
                <Filter placeholder="Username" />
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
