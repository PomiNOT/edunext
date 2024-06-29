import { DomainError } from "../services/errors";

export class Student {
  #id;
  #userId;
  fullName;
  #semesterNumber;

  get id() {
    return this.#id;
  }

  get userId() {
    return this.#userId;
  }

  get semesterNumber() {
    return this.#semesterNumber;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);

      if (Number.isNaN(this.#id)) {
        throw new DomainError("Student id must be a number");
      }
    } else {
      this.#id = id;
    }
  }

  set userId(id) {
    if (typeof id !== "number") {
      this.#userId = parseInt(id);

      if (Number.isNaN(this.#userId)) {
        throw new DomainError("User id must be a number");
      }
    } else {
      this.#userId = id;
    }
  }

  set semesterNumber(no) {
    if (typeof no !== "number") {
      no = parseInt(no);

      if (Number.isNaN(no)) {
        throw new DomainError("Semester number must be a number");
      }
    }

    if (no < 1 || no > 9) {
      throw new DomainError("Semester number must be between 1 and 9");
    }

    this.#semesterNumber = no;
  }

  fromObject(obj) {
    this.id = obj.id;
    this.userId = obj.userId;
    this.fullName = obj.fullName;
    this.semesterNumber = obj.semesterNumber;
  }

  toObject() {
    return {
      userId: this.#userId,
      fullName: this.fullName,
      semesterNumber: this.#semesterNumber,
    };
  }
}
