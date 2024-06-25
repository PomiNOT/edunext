import { client } from './client';
import { DomainError } from './errors';

export class User {
  #role;
  #password;
  username;

  get role() {
    return this.#role;
  }

  set role(role) {
    if (!['admin', 'teacher', 'student'].includes(role)) {
      throw new Error('User role must be admin, teacher or student');
    }

    this.#role = role;
  }

  set password(password) {
    if (password.length < 8) {
      throw new Error('Password length must be greater than 8');
    }

    this.#password = password;
  }

  toObject() {
    return {
      username,
      password,
      role: this.#role
    };
  }
}


/** @returns {User | null} the user */
export async function login(username, password) {
  const response = await client.get('users', {
    params: { username }
  });

  if (response.data.length === 0) {
    throw new DomainError('Username not found');
  }

  const data = response.data[0];

  if (data.password !== password) {
    throw new DomainError('Password does not match');
  }

  const user = new User();
  user.username = data.username;
  user.password = data.password;
  user.role = data.role;

  saveToSessionStorage({
    username: data.username,
    role: data.role
  });

  return user;
}

export function getCurrentUser() {
  try {
    return loadFromSessionStorage();
  } catch (err) {
    return null;
  }
}

function saveToSessionStorage(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

function loadFromSessionStorage() {
  const { username, role } = JSON.parse(sessionStorage.getItem('user'));
  const user = new User();
  user.username = username;
  user.role = role;
  return user;
}