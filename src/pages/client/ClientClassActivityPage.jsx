import { Breadcrumb, Container, Card, Tabs, Tab } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { QuestionItem } from "../../components/QuestionItem";
import * as activitiesService from "../../services/activities";
import * as slotsService from "../../services/slots";
import * as classroomsService from "../../services/classrooms";

const ClientClassDetailContext = createContext();

function Wrapper({ children }) {
  const { activityId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [activity, setActivity] = useState(null);
  const [slot, setSlot] = useState(null);
  const [activities , setActivities] = useState([]);

  async function fetchInformation() {
    const activity = await activitiesService.getActivityById(activityId);
    const classroom = await classroomsService.getClassById(activity.classId);
    const slot = await slotsService.getSlotById(activity.slotId);
    const activities = await activitiesService.getAllActivitiesForSlotByClass(slot.id, activity.classId);

    setActivity(activity);
    setClassroom(classroom);
    setSlot(slot);
    setActivities(activities);
  }

  useEffect(() => {
    fetchInformation();
  }, []);

  return (
    <ClientClassDetailContext.Provider
      value={{ classroom, activity, slot, activities }}
    >
      {children}
    </ClientClassDetailContext.Provider>
  )
}

function TableOfContents() {
  const { activities } = useContext(ClientClassDetailContext);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Table of Contents</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-3">
        {activities.map((activity) => <QuestionItem key={activity.id} content={activity.content} />)}
      </Card.Body>
    </Card>
  )
}

function TopContent() {
  const { classroom, activity, slot } = useContext(ClientClassDetailContext);
  const classLink = `/client/classes/${activity?.classId}`;
  const slotLink = `/client/slots/${activity?.classId}/${activity?.slotId}`;

  return (
    <>
      <Breadcrumb className="p-0 mt-4">
        <Breadcrumb.Item as={Link} to="/client/classes" href="/client/classes">
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={classLink} href={classLink}>
          {classroom?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={slotLink} href={slotLink}>
          Slot {slot?.slotNumber}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{activity?.content}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-2xl mb-3 font-bold">
        (Question) {activity?.content}
      </h1>
    </>
  );
}

function MainContent() {
  const { activity } = useContext(ClientClassDetailContext);

  return (
    <div className="space-y-3">
      <Card>
        <Card.Header>
          <Card.Title>Content</Card.Title>
        </Card.Header>
        <Card.Body>{activity?.content}</Card.Body>
      </Card>

      <p>
        Discussion time has been started.
        <br />
        Students can comment and vote for comments during this time.
      </p>

      <Tabs defaultActiveKey="group">
        <Tab eventKey="group" title="Group"></Tab>
        <Tab eventKey="discuss" title="Discuss"></Tab>
        <Tab eventkey="grade" title="Grade"></Tab>
        <Tab eventKey="msg" title="Teacher's Message"></Tab>
      </Tabs>
    </div>
  );
}

export default function ClientClassActivityPage() {
  return (
    <Wrapper>
      <Container>
        <TopContent />
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3">
            <MainContent />
          </div>
          <div>
            <TableOfContents />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}
