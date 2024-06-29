import { client } from "./client";
import { DomainError } from "./errors";
import { Subject } from "../models/subject";

export async function getAll() {
  const response = await client.get("subjects");

  return response.data.map((subject) => {
    const subjectModel = new Subject();
    subjectModel.fromObject(subject);
    return subjectModel;
  });
}

export async function createSubject({ name, semesterNumber }) {
  const subject = new Subject();
  subject.name = name;
  subject.semesterNumber = semesterNumber;

  const response = await client.post("subjects", subject.toObject());
  const subjectModel = new Subject();
  subjectModel.fromObject(response.data);
  return subjectModel;
}
