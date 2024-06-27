import { DomainError } from "../services/errors";
import bcryptjs from "bcryptjs";

export class AuthUser {
  #id;
  #role;
  #password;
  #hashedPassword;
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

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);
    } else {
      this.#id = id;
    }
  }

  get id() {
    return this.#id;
  }

  verifyPassword(password) {
    return bcryptjs.compareSync(password, this.#hashedPassword);
  }

  fromObject(data) {
    this.id = data.id;
    this.username = data.username;
    this.#hashedPassword = data.password;
    this.role = data.role;
  }

  toObject() {
    const hashedPassword = bcryptjs.hashSync(this.#password, 10);

    return {
      username: this.username,
      password: hashedPassword,
      role: this.#role,
    };
  }
}
