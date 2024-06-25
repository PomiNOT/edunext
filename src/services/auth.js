import { client } from './client';

export class User {
  #role;
  #password;

  constructor(username, password, role) {
    this.role = role;
    this.username = username;
    this.password = password;
  }

  get role() {
    return this.#role;
  }

  set role(role) {
    if (!['admin', 'teacher', 'user'].includes(role)) {
      throw new Error('User role must be admin, teacher or user');
    }

    this.#role = role;
  }

  get password() {
    return this.#password;
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
      role
    };
  }
}


/** @returns {User | null} the user */
export async function login(username, password) {
  const response = await client.get('users', {
    params: { username, password }
  });

  if (response.status === 404) {
    return null;
  }

  const data = response.data;

  return new User(data.username, data.password, data.role);
}
