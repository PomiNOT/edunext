import { DomainError } from "../services/errors";

function unixToCustomFormat(unixTimestamp) {
  const date = new Date(unixTimestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export class Comment {
  #id;
  #content;
  #activityId;
  #userId;
  #username;
  #date;
  #votes;

  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }
  get content() {
    return this.#content;
  }

  get activityId() {
    return this.#activityId;
  }

  get userId() {
    return this.#userId;
  }

  get date() {
    return unixToCustomFormat(this.#date);
  }

  get votes() {
    return this.#votes;
  }

  set id(id) {
    if (typeof id !== "number") {
      this.#id = parseInt(id);
      if (Number.isNaN(this.#id)) {
        throw new DomainError("Comment id must be a number");
      }
    } else {
      this.#id = id;
    }
  }

  set content(content) {
    if (typeof content !== "string") {
      throw new DomainError("Comment content must be a string");
    }

    if (content.trim() === "") {
      throw new DomainError("Comment content cannot be empty");
    }

    this.#content = content;
  }

  set activityId(activityId) {
    if (typeof activityId !== "number") {
      this.#activityId = parseInt(activityId);
      if (Number.isNaN(this.#activityId)) {
        throw new DomainError("Comment activityId must be a number");
      }
    } else {
      this.#activityId = activityId;
    }
  }

  set userId(userId) {
    if (typeof userId !== "number") {
      this.#userId = parseInt(userId);
      if (Number.isNaN(this.#userId)) {
        throw new DomainError("Comment userId must be a number");
      }
    } else {
      this.#userId = userId;
    }
  }

  set date(date) {
    if (typeof date !== "number") {
      this.#date = parseInt(date);
      if (Number.isNaN(this.#date)) {
        throw new DomainError("Comment date must be a number");
      }
    } else {
      this.#date = date;
    }
  }

  set votes(votes) {
    if (typeof votes !== "number") {
      this.#votes = parseInt(votes);
      if (Number.isNaN(this.#votes)) {
        throw new DomainError("Comment votes must be a number");
      }
    } else {
      this.#votes = votes;
    }
  }

  toObject() {
    return {
      content: this.#content,
      activityId: this.#activityId,
      userId: this.#userId,
      date: this.#date,
      votes: this.#votes
    };
  }

  fromObject(obj) {
    this.id = obj.id;
    this.content = obj.content;
    this.activityId = obj.activityId;
    this.userId = obj.userId;
    this.date = obj.date;
    this.votes = obj.votes;
    this.#username = obj.user.username;
  }
}

