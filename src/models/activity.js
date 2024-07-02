import { DomainError } from "../services/errors";

export class Activity {
  #id;
  #slotId;
  #classId;
  content;
  #started;

  get id() {
    return this.#id;
  }

  get slotId() {
    return this.#slotId;
  }

  get classId() {
    return this.#classId;
  }

  get started() {
    return this.#started;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);

      if (Number.isNaN(this.#id)) {
        throw new DomainError("Activity id must be a number");
      }
    } else {
      this.#id = id;
    }
  }

  set slotId(id) {
    if (typeof id !== "number") {
      this.#slotId = parseInt(id);

      if (Number.isNaN(this.#slotId)) {
        throw new DomainError("Slot id must be a number");
      }
    } else {
      this.#slotId = id;
    }
  }

  set classId(id) {
    if (typeof id !== "number") {
      this.#classId = parseInt(id);

      if (Number.isNaN(this.#classId)) {
        throw new DomainError("Class id must be a number");
      }
    } else {
      this.#classId = id;
    }
  }

  set started(started) {
    if (typeof started !== "boolean") {
      throw new DomainError("Activity started must be a boolean");
    }

    this.#started = started;
  }

  toObject() {
    return {
      slotId: this.slotId,
      classId: this.classId,
      content: this.content,
      started: this.started,
    };
  }

  fromObject(obj) {
    this.id = obj.id;
    this.slotId = obj.slotId;
    this.classId = obj.classId;
    this.content = obj.content;
    this.started = obj.started;
  }
}
