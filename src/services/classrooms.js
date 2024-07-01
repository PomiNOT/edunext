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

export async function getClassesForTeacher(teacherId) {
  const response = await client.get("classes", {
    params: {
      _expand: ["subject", "user"],
      userId: teacherId
    },
  });

  return response.data.map((classroom) => {
    const classroomModel = new Classroom();
    classroomModel.fromObject(classroom);
    return classroomModel;
  })
}

export async function getClassesForStudent(studentId) {
  const response = await client.get("classes", {
    params: {
      _expand: ["subject", "user"],
      'studentIds_like': studentId
    },
  });

  return response.data.map((classroom) => {
    const classroomModel = new Classroom();
    classroomModel.fromObject(classroom);
    return classroomModel;
  })
}

async function getClassById(id) {
  const response = await client.get(`classes/${id}`, {
    params: {
      _expand: ["subject", "user"]
    },
  });

  const ret = new Classroom();
  ret.fromObject(response.data);
  return ret;
}

export async function createClass({ name, teacherId, subjectId, studentIds }) {
  const classroom = new Classroom();
  classroom.name = name;
  classroom.teacherId = teacherId;
  classroom.subjectId = subjectId;
  classroom.studentIds = studentIds;

  const response = await client.post("classes", classroom.toObject());

  return await getClassById(response.data.id);
}
