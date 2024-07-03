import { client } from "./client";
import { getAllSlots } from "./slots";
import { getClassById } from "./classrooms";
import { Activity } from "../models/activity";

async function populateSlotWithActivities(slot, classId) {
  const response = await client.get("activitys", {
    params: {
      slotId: slot.id,
      classId
    },
  });

  const activities = response.data.map((activity) => {
    const activityModel = new Activity();
    activityModel.fromObject(activity);
    return activityModel;
  });

  slot.questions = activities;
}

export async function getAllActivitiesGroupedBySlotForClass(classId) {
  const classroom = await getClassById(classId);
  const slots = await getAllSlots(classroom.subjectId);

  const tasks = slots.map((slot) => populateSlotWithActivities(slot, classId));

  await Promise.all(tasks);

  return slots;
}

export async function getAllActivitiesForSlotByClass(slotId, classId) {
  const response = await client.get("activitys", {
    params: {
      slotId,
      classId
    },
  });

  const activities = response.data.map((activity) => {
    const activityModel = new Activity();
    activityModel.fromObject(activity);
    return activityModel;
  });

  return activities;
}
