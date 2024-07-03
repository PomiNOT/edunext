import { useContext, createContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Tabs,
  Button,
  Tab,
  Breadcrumb,
  Dropdown,
  DropdownButton,
  Modal,
  Form,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as slotsService from "../../services/slots";
import * as activitiesService from "../../services/activities";
import { QuestionItem } from "../../components/QuestionItem";

const ClientSlotDetailContext = createContext();

function TopContent() {
  const [show, setShow] = useState(false);
  const { slot } = useContext(ClientSlotDetailContext);
  const { classId } = useParams();

  return (
    <Container className="mt-4">
      <Breadcrumb className='p-0'>
        <Breadcrumb.Item as={Link} to='/client/classes' href='/client/classes'>Home</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`/client/classes/${classId}`} href={`/client/classes/${classId}`}>Slot { slot?.slotNumber }</Breadcrumb.Item>
        <Breadcrumb.Item className="max-w-64 truncate text-ellipsis">{ slot?.description }</Breadcrumb.Item>
      </Breadcrumb>

      <Button variant="outline-primary" onClick={() => setShow(!show)}>{ show ? 'Hide' : 'Show'} Info Session</Button>
      {show && <p className="border p-3 mt-3 whitespace-pre">
        {slot?.description}
      </p>}
    </Container>
  );
}

function AddNewActivityModal({ onDone }) {
  const [validated, setValidated] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    onDone();
  }

  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>Add new activity</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Activity name</Form.Label>
            <Form.Control required type="text" placeholder="Activity name" />
            <Form.Control.Feedback type="invalid">
              Activity name is required
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onDone}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function ImportActivitiesModal({ onDone }) {
  const { slot } = useContext(ClientSlotDetailContext);
  const [map, setMap] = useState(() => {
    return slot.questions.reduce((map, question, index) => {
      map[index] = {
        index,
        question,
        selected: false
      };

      return map
    }, {});
  });

  function toggle(index) {
    const newMap = { ...map };
    newMap[index].selected = !newMap[index].selected;
    setMap(newMap);
  }

  function getSelectedQuestions() {
    return Object.values(map).filter((question) => question.selected).map(({ question }) => question);
  }

  function handleSubmit() {
    const selectedQuestions = getSelectedQuestions();
    onDone();
  }

  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>Import activities</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.values(map).map((question) => (
          <Form.Check
            type="checkbox"
            label={question.question}
            onChange={() => toggle(question.index)}
            checked={question.selected}
          />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onDone}>
          Close
        </Button>
        <Button variant="primary" disabled={getSelectedQuestions().length === 0} onClick={handleSubmit}>Import</Button>
      </Modal.Footer>
    </Modal>
  );
}

function SlotContentList() {
  const { activities } = useContext(ClientSlotDetailContext);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showImportActivitiesModal, setShowImportActivitiesModal] = useState(false);

  return (
    <>
      {showAddActivityModal && <AddNewActivityModal onDone={() => setShowAddActivityModal(false)} />}
      {showImportActivitiesModal && <ImportActivitiesModal onDone={() => setShowImportActivitiesModal(false)} />}

      {activities.map((activity) => (
        <div className="flex gap-3">
          <div className="flex-1">
            <QuestionItem
              key={activity.id}
              showStatus={true}
              content={activity.content}
              started={activity.started}
            />
          </div>

          <Button variant={activity.started ? "outline-danger" : "success"}>
            {activity.started ? "End" : "Start"}
          </Button>
        </div>
      ))}

      {activities.length === 0 && <p>No activities found</p>}

      <DropdownButton
        title="Add activity"
        variant="outline-primary"
        className="mt-3"
      >
        <Dropdown.Item onClick={() => setShowAddActivityModal(true)}>
          Add new activity
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setShowImportActivitiesModal(true)}>
          Import activities
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

function Content() {
  return (
    <Tabs defaultActiveKey="activity" className="mb-3">
      <Tab eventKey="activity" title="Content">
        <SlotContentList />
      </Tab>
      <Tab eventKey="settings" title="Students">
        Students
      </Tab>
    </Tabs>
  );
}

function Wrapper({ children }) {
  const [activities, setActivities] = useState([]);
  const [slot, setSlot] = useState(null);
  const { slotId, classId } = useParams();

  useEffect(() => {
    activitiesService.getAllActivitiesForSlotByClass(slotId, classId).then(setActivities);
    slotsService.getSlotById(slotId).then(setSlot);
  }, []);

  return (
    <ClientSlotDetailContext.Provider
      value={{ activities, slot }}
    >
      {children}
    </ClientSlotDetailContext.Provider>
  );
}

export default function ClientSlotDetailPage() {
  return (
    <>
      <Wrapper>
        <TopContent />
        <Container className="mt-3">
          <Card>
            <Card.Body>
                <Content />
            </Card.Body>
          </Card>
        </Container>
      </Wrapper>
    </>
  );
}
