import { client } from "./client";
import { getAllSlots } from "./slots";
import { getClassById } from "./classrooms";
import { Activity } from "../models/activity";

async function populateSlotWithActivities(slot, classId, started) {
  const response = await client.get("activitys", {
    params: {
      slotId: slot.id,
      classId,
      ...(started === 'any' ? {} : { started }),
    },
  });

  const activities = response.data.map((activity) => {
    const activityModel = new Activity();
    activityModel.fromObject(activity);
    return activityModel;
  });

  slot.questions = activities;
}

export async function getAllActivitiesGroupedBySlotForClass(classId, started = 'any') {
  const classroom = await getClassById(classId);
  const slots = await getAllSlots(classroom.subjectId);

  const tasks = slots.map((slot) => populateSlotWithActivities(slot, classId, started));

  await Promise.all(tasks);

  if (started !== 'any') {
    return slots.filter((slot) => slot.questions.length > 0);
  }

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

export async function startActivity(activityId) {
  const response = await client.patch(`activitys/${activityId}`, { started: true });
  const activity = new Activity();
  activity.fromObject(response.data);
  return activity;
}

export async function stopActivity(activityId) {
  const response = await client.patch(`activitys/${activityId}`, { started: false });
  const activity = new Activity();
  activity.fromObject(response.data);
  return activity;
}

export async function addActivity({ slotId, classId, content }) {
  const activity = new Activity();
  activity.slotId = slotId;
  activity.classId = classId;
  activity.content = content;
  activity.started = false;

  const response = await client.post("activitys", activity.toObject());
  const activityModel = new Activity();
  activityModel.fromObject(response.data);

  return activityModel;
}

export async function getActivityById(activityId) {
  const response = await client.get(`activitys/${activityId}`);
  const activityModel = new Activity();
  activityModel.fromObject(response.data);
  return activityModel;
}
