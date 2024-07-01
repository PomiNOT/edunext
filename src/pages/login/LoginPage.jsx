import { Form, Button, FormGroup } from "react-bootstrap";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContextComponent";
import { Navigate } from "react-router-dom";
import { DomainError } from "../../services/errors";

function LoginForm() {
  const { login } = useContext(UserContext);
  const [validated, setValidated] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const username = form.username.value;
    const password = form.password.value;

    try {
      await login(username, password);
    } catch (err) {
      if (err instanceof DomainError) {
        alert(err.message);
      } else {
        throw err;
      }
    }
  };

  return (
    <div className="w-3/4">
      <div className="text-center">
        <h1 className="font-bold mb-3 text-2xl">Login</h1>
      </div>
      <Form
        noValidate
        onSubmit={onSubmit}
        validated={validated}
        onChange={() => setValidated(false)}
      >
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required
          </Form.Control.Feedback>
        </Form.Group>
        <FormGroup className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required
          </Form.Control.Feedback>
        </FormGroup>
        <Button type="submit">Log in</Button>
      </Form>
    </div>
  );
}

export default function LoginPage() {
  const { user } = useContext(UserContext);

  switch (user?.role) {
    case "admin":
      return <Navigate to="/admin/subjects" />;
    case "teacher":
    case "student":
      return <Navigate to="/client/classes" />;
  }

  return (
    <main className="h-screen flex">
      <div className="flex-1 grid place-items-center">
        <LoginForm />
      </div>
      <div className="flex-1">
        <img src="cover.jpg" className="w-full h-full object-cover" />
      </div>
    </main>
  );
}
