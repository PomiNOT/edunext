import { DomainError } from "../services/errors";
import { client } from "./client";
import { Classroom } from "../models/classroom";

export async function getAll() {
  const response = await client.get("classes", {
    params: {
      _expand: ["subject", "user"]
    },
  });

  return response.data.map((classroom) => {
    const classroomModel = new Classroom();
    classroomModel.fromObject(classroom);
    return classroomModel;
  });
}
