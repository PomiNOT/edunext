import { DomainError } from "../services/errors";

export class User {
  #role;
  #password;
  username;

  get role() {
    return this.#role;
  }

  set role(role) {
    if (!["admin", "teacher", "student"].includes(role)) {
      throw new DomainError("User role must be admin, teacher or student");
    }

    this.#role = role;
  }

  set password(password) {
    if (password.length < 8) {
      throw new DomainError("Password length must be greater than 8");
    }

    this.#password = password;
  }

  toObject() {
    return {
      username,
      password,
      role: this.#role,
    };
  }
}
