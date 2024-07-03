import { client } from "./client";
import { Slot } from "../models/slot";

export async function getAllSlots(subjectId) {
  const response = await client.get('slots', {
    params: {
      subjectId,
      _sort: 'slotNumber',
    },
  });
  return response.data.map((slot) => {
    const slotModel = new Slot();
    slotModel.fromObject(slot);
    return slotModel;
  });
}

async function getMaxSlotNumber(subjectId) {
  const response = await client.get('slots', {
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
  const slotModel = new Slot();
  slotModel.subjectId = subjectId;
  slotModel.slotNumber = await getMaxSlotNumber(subjectId) + 1;

  const response = await client.post("slots", slotModel.toObject());
  slotModel.fromObject(response.data);

  return slotModel;
}

export async function updateSlot(slotId, { slotNumber, description, questions }) {
  const slotModel = new Slot();
  slotModel.id = slotId;
  slotModel.slotNumber = slotNumber;
  slotModel.description = description;
  slotModel.questions = questions;

  const response = await client.patch(`slots/${slotId}`, slotModel.toObject());
  slotModel.fromObject(response.data);
  return slotModel;
}

export async function deleteSlot(slotId) {
  await client.delete(`slots/${slotId}`);
}

export async function getSlotById(slotId) {
  const response = await client.get(`slots/${slotId}`);
  const slotModel = new Slot();
  slotModel.fromObject(response.data);
  return slotModel;
}
