import { DomainError } from "./errors";
export class Person {
  fullName;
  #dateOfBirth;
  #phone;

  get dateOfBirth() {
    return this.#dateOfBirth;
  }

  set dateOfBirth(dateOfBirth) {
    // validate not in the future
    if (new Date(dateOfBirth) > new Date()) {
      throw new DomainError("Date of birth cannot be in the future");
    }
  }

  get phone() {
    return this.#phone;
  }

  set phone(phone) {
    if (phone.length !== 10) {
      throw new DomainError("Phone number must be 10 digits");
    }
  }

  toObject() {
    return {
      fullName: this.fullName,
      dateOfBirth: this.dateOfBirth,
      phone: this.phone,
    };
  }
}
