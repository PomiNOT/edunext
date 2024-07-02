import { DomainError } from "../services/errors";

export class Slot {
  #id;
  #subjectId;
  #slotNumber = 1;
  description = '';
  questions = [];

  get id() {
    return this.#id;
  }

  get slotNumber() {
    return this.#slotNumber;
  }

  get subjectId() {
    return this.#subjectId;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);

      if (Number.isNaN(this.#id)) {
        throw new DomainError("Slot id must be a number");
      }
    } else {
      this.#id = id;
    }
  }

  set slotNumber(no) {
    if (typeof no !== "number") {
      this.#slotNumber = parseInt(no);
      if (Number.isNaN(this.#slotNumber)) {
        throw new DomainError("Slot number must be a number");
      }
    } else {
      this.#slotNumber = no;
    }

    if (this.#slotNumber < 1) {
      throw new DomainError("Slot number must be greater than 0");
    }
  }

  set subjectId(id) {
    if (typeof id !== "number") {
      this.#subjectId = parseInt(id);
      if (Number.isNaN(this.#subjectId)) {
        throw new DomainError("Subject id must be a number");
      }
    } else {
      this.#subjectId = id;
    }
  }

  toObject() {
    return {
      subjectId: this.#subjectId,
      slotNumber: this.#slotNumber,
      description: this.description,
      questions: this.questions
    };
  }

  fromObject(obj) {
    this.id = obj.id;
    this.subjectId = obj.subjectId;
    this.slotNumber = obj.slotNumber;
    this.description = obj.description;
    this.questions = obj.questions;
  }
}
