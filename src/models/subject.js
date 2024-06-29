import { DomainError } from "../services/errors";

export class Subject {
  #id;
  name;
  #semesterNumber;

  get id() {
    return this.#id;
  }

  get semesterNumber() {
    return this.#semesterNumber;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);

      if (Number.isNaN(this.#id)) {
        throw new DomainError("Subject id must be a number");
      }
    } else {
      this.#id = id;
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
    this.name = obj.name;
    this.semesterNumber = obj.semesterNumber;
  }

  toObject() {
    return {
      name: this.name,
      semesterNumber: this.#semesterNumber
    };
  }
}
