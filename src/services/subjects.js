import { client } from "./client";
import { Subject } from "../models/subject";
import { SlotTemplate } from "../models/slotTemplate";

export async function getAll() {
  const response = await client.get("subjects");

  return response.data.map((subject) => {
    const subjectModel = new Subject();
    subjectModel.fromObject(subject);
    return subjectModel;
  });
}

export async function getAllSlots(subjectId) {
  const response = await client.get('slot_templates', {
    params: {
      subjectId,
      _sort: 'slotNumber',
    },
  });
  return response.data.map((slot) => {
    const slotModel = new SlotTemplate();
    slotModel.fromObject(slot);
    return slotModel;
  });
}

export async function getSubjectById(id) {
  const response = await client.get(`subjects/${id}`);
  const subjectModel = new Subject();
  subjectModel.fromObject(response.data);
  return subjectModel;
}

export async function updateSubject(id, { name, semesterNumber }) {
  const subject = new Subject();
  subject.id = id;
  subject.name = name;
  subject.semesterNumber = semesterNumber;

  const response = await client.patch(`subjects/${id}`, subject.toObject());
  const subjectModel = new Subject();
  subjectModel.fromObject(response.data);
  return subjectModel;
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

async function getMaxSlotNumber(subjectId) {
  const response = await client.get('slot_templates', {
    params: {
      subjectId,
      _sort: 'slotNumber',
      _order: 'desc',
      _limit: 1,
    },
  });

  return response.data[0]?.slotNumber || 0;
}

export async function createSlot(subjectId) {
  const slotModel = new SlotTemplate();
  slotModel.subjectId = subjectId;
  slotModel.slotNumber = await getMaxSlotNumber(subjectId) + 1;

  const response = await client.post("slot_templates", slotModel.toObject());
  slotModel.fromObject(response.data);

  return slotModel;
}

export async function updateSlot(slotId, { slotNumber, description, questions }) {
  const slotModel = new SlotTemplate();
  slotModel.id = slotId;
  slotModel.slotNumber = slotNumber;
  slotModel.description = description;
  slotModel.questions = questions;

  const response = await client.patch(`slot_templates/${slotId}`, slotModel.toObject());
  slotModel.fromObject(response.data);
  return slotModel;
}

export async function deleteSlot(slotId) {
  await client.delete(`slot_templates/${slotId}`);
}
