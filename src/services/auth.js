import { client } from "./client";
import { AuthUser } from "../models/authUser";
import { DomainError } from "./errors";

export async function getAll() {
  const response = await client.get("users");
  return response.data;
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

  if (data.password !== password) {
    throw new DomainError("Password does not match");
  }

  const user = new AuthUser();
  user.username = data.username;
  user.role = data.role;

  saveToSessionStorage({
    username: data.username,
    role: data.role,
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
  const { username, role } = JSON.parse(sessionStorage.getItem("user"));
  const user = new AuthUser();
  user.username = username;
  user.role = role;
  return user;
}
