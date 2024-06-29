import { client } from "./client";
import { AuthUser } from "../models/authUser";
import { DomainError } from "./errors";
import { createStudent, deleteStudent } from "./students";

export async function getAll() {
  const response = await client.get("users");

  return response.data.map((user) => {
    const authUser = new AuthUser();
    authUser.fromObject(user);
    return authUser;
  });
}

export async function register(username, password, role) {
  const user = new AuthUser();
  user.username = username;
  user.password = password;
  user.role = role;

  let response = await client.get("users", {
    params: { username },
  });

  if (response.data.length !== 0) {
    throw new DomainError("Username already exists");
  }

  response = await client.post("users", user.toObject());

  await createPersonByRole(response.data.id, username, role);

  const authUser = new AuthUser();
  authUser.fromObject(response.data);
  return authUser;
}

async function deletePersonByRole(userId) {
  switch (getCurrentUser().role) {
    case "student":
      return deleteStudent(userId);
    default:
      console.log(`Unknown role: ${getCurrentUser().role}`);
      break;
  }
}

async function createPersonByRole(userId, username, role) {
  switch (role) {
    case "student":
      return createStudent({ userId, fullName: username, semesterNumber: 1 });
    default:
      console.log(`Unknown role: ${role}`);
      break;
  }
}

export async function changePassword(id, password) {
  const user = new AuthUser();
  user.id = id;
  user.password = password;

  const response = await client.patch(`users/${id}`, user.toObject());

  if (response.status !== 200) {
    throw new DomainError("Failed to change password");
  }

  const authUser = new AuthUser();
  authUser.fromObject(response.data);
  return authUser;
}

export async function deleteUser(id) {
  const user = getCurrentUser();

  if (user.id === id) {
    throw new DomainError("You cannot delete yourself");
  }

  try {
    const response = await client.delete(`users/${id}`);
  } catch (err) {
    if (err.response.status === 404) {
      throw new DomainError("User not found");
    } else {
      throw err;
    }
  }

  await deletePersonByRole(id);
}

/** @returns {AuthUser | null} the user */
export async function login(username, password) {
  const response = await client.get("users", {
    params: { username },
  });

  if (response.data.length === 0) {
    throw new DomainError("Username not found");
  }

  const data = response.data[0];
  const user = new AuthUser();
  user.fromObject(data);

  if (!user.verifyPassword(password)) {
    throw new DomainError("Password does not match");
  }

  saveToSessionStorage({
    username: user.username,
    role: user.role,
    id: user.id,
  });

  return user;
}

export function logout() {
  sessionStorage.removeItem("user");
}

export function getCurrentUser() {
  try {
    return loadFromSessionStorage();
  } catch (err) {
    return null;
  }
}

function saveToSessionStorage(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

function loadFromSessionStorage() {
  const { username, role, id } = JSON.parse(sessionStorage.getItem("user"));
  const user = new AuthUser();
  user.id = id;
  user.username = username;
  user.role = role;
  return user;
}

register("admin", "password", "admin");
