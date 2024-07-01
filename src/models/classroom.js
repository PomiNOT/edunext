import { DomainError } from "../services/errors";

export class Classroom {
  #id;
  #subjectId;
  #subjectName;
  name;
  #teacherId;
  #teacherName;
  #studentIds;

  get studentIds() {
    return this.#studentIds;
  }

  get id() {
    return this.#id;
  }

  get subjectId() {
    return this.#subjectId;
  }

  get teacherId() {
    return this.#teacherId;
  }

  get teacherName() {
    return this.#teacherName;
  }

  get subjectName() {
    return this.#subjectName;
  }

  get studentCount() {
    return this.studentIds.length;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);

      if (Number.isNaN(this.#id)) {
        throw new DomainError("Classroom id must be a number");
      }
    } else {
      this.#id = id;
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

  set teacherId(id) {
    if (typeof id !== "number") {
      this.#teacherId = parseInt(id);

      if (Number.isNaN(this.#teacherId)) {
        throw new DomainError("Teacher id must be a number");
      }
    } else {
      this.#teacherId = id;
    }
  }

  set studentIds(ids) {
    if (!Array.isArray(ids)) {
      throw new DomainError("Student ids must be an array");
    }

    this.#studentIds = ids.map((id) => {
      if (typeof id !== "number") {
        const num = parseInt(id);

        if (Number.isNaN(num)) {
          throw new DomainError("Student id must be a number");
        }

        return num;
      }

      return id;
    });
  }

  toObject() {
    return {
      subjectId: this.subjectId,
      userId: this.teacherId,
      studentIds: this.studentIds,
      name: this.name
    };
  }

  fromObject(obj) {
    this.id = obj.id;
    this.subjectId = obj.subjectId;
    this.#subjectName = obj.subject.name;
    this.name = obj.name;
    this.teacherId = obj.userId;
    this.#teacherName = obj.user.username;
    this.studentIds = obj.studentIds;
  }
}



