import { client } from "./client";
import { DomainError } from "./errors";
import { Student } from "../models/personels";

export async function createStudent({ userId, fullName, semesterNumber }) {
  const student = new Student();
  student.userId = userId;
  student.fullName = fullName;
  student.semesterNumber = semesterNumber;

  let response = await client.get("students", {
    params: { userId },
  });

  if (response.data.length !== 0) {
    throw new DomainError("Student already exists");
  }

  response = await client.post("students", student.toObject());
  return student.fromObject(response.data);
}

export async function deleteStudent(id) {
  try {
    const response = await client.delete(`students/${id}`);
  } catch (err) {
    if (err.response.status === 404) {
      throw new DomainError("Student not found");
    } else {
      throw err;
    }
  }
}
