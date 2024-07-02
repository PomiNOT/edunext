import SlotListing from "../../components/SlotListing";
import { Button, Card, ListGroup, Form, Modal, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBook,
  faAdd,
  faTrash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useState, useContext, createContext, useEffect } from "react";
import { DomainError } from "../../services/errors";
import * as subjectsService from "../../services/subjects";
import * as getAllSlots from "../../services/slots";

const SubjectDetailContext = createContext();

function QuestionsEditor({ questions: theQuestions, onChange }) {
  const [questions, setQuestions] = useState(theQuestions);

  function handleAddQuestion() {
    const newQuestions = [...questions, ""];
    setQuestions(newQuestions);
    onChange(newQuestions);
  }

  function handleDeleteQuestion(index) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onChange(newQuestions);
  }

  return (
    <>
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Row key={index}>
            <Col sm={10}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  defaultValue={question}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = e.target.value;
                    setQuestions(newQuestions);
                    onChange(newQuestions);
                  }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Question text is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className="col-auto justify-content-end">
              <Button variant="danger" onClick={() => handleDeleteQuestion(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        ))}
      </div>
      <div className="mt-3">
        <Button
          variant="primary"
          onClick={handleAddQuestion}
          className="w-full"
        >
          <FontAwesomeIcon icon={faAdd} className="mr-2" />
          Add Question
        </Button>
      </div>
    </>
  );
}

function SlotSettingsEditor({ slot, onSubmit }) {
  const [slotNumber, setSlotNumber] = useState(slot.slotNumber);
  const [description, setDescription] = useState(slot.description);
  const [questions, setQuestions] = useState(slot.questions);
  const [validated, setValidated] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    onSubmit({ slotNumber, description, questions });
  }

  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>Slot Settings</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} validated={validated}>
        <Modal.Body className="space-y-3">
          <Form.Group>
            <Form.Label>Slot Number</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Slot Number"
              defaultValue={slot.slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Slot Number is required and must start at 1.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              placeholder="Description"
              defaultValue={slot.description}
              as="textarea"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Questions</Form.Label>
            <QuestionsEditor questions={questions} onChange={setQuestions} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onSubmit(null)}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function List() {
  const { slots, updateSlot, deleteSlot } = useContext(SubjectDetailContext);
  const [currentSlot, setCurrentSlot] = useState(null);

  function openSlot(event, slot) {
    event.stopPropagation();
    setCurrentSlot(slot);
  }

  async function saveSlot(slot) {
    setCurrentSlot(null);

    if (!slot) {
      return;
    }

    try {
      await updateSlot(currentSlot.id, slot);
    } catch (error) {
      if (error instanceof DomainError) {
        alert(error.message);
      } else {
        throw error;
      }
    }
  }

  async function handleDeleteSlot(event, id) {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    try {
      await deleteSlot(id);
    } catch (error) {
      if (error instanceof DomainError) {
        alert(error.message);
      } else {
        throw error;
      }
    }
  }

  return (
    <div className="space-y-3">
      { currentSlot && <SlotSettingsEditor slot={currentSlot} onSubmit={saveSlot} /> }
      {slots.map((slot) => (
        <SlotListing key={slot.id} slot={slot}>
          <div className="space-x-2">
            <Button variant="outline-danger" onClick={(event) => handleDeleteSlot(event, slot.id)}>Delete Slot</Button>
            <Button variant="outline-primary" onClick={(event) => openSlot(event, slot)}>Settings Slot</Button>
          </div>
        </SlotListing>
      ))}
    </div>
  );
}

function Heading({ children }) {
  return <h1 className="text-xl font-bold text-uppercase">{children}</h1>;
}

function GeneralEditForm({ subject }) {
  const { updateSubject } = useContext(SubjectDetailContext);

  const [name, setName] = useState(subject.name);
  const [semesterNumber, setSemesterNumber] = useState(subject.semesterNumber);
  const [validated, setValidated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      await updateSubject({ name, semesterNumber });
      alert("Subject updated successfully");
    } catch (err) {
      if (err instanceof DomainError) {
        alert(err.message);
        return;
      } else {
        throw err;
      }
    }
  }

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <Form.Group className="mb-3">
        <Form.Label>Subject Name</Form.Label>
        <Form.Control required value={name} type="text" placeholder="Subject Name" onChange={(e) => setName(e.target.value)} />
        <Form.Control.Feedback type="invalid">Subject name is required</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Semester</Form.Label>
        <Form.Select onChange={(e) => setSemesterNumber(e.target.value)} value={semesterNumber}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
}

function Content({ menu }) {
  const { subject, createSlot } = useContext(SubjectDetailContext);

  async function handleCreateSlot() {
    await createSlot();
  }

  if (menu === "general" && subject) {
    return (
      <Card>
        <Card.Header className="flex justify-between">
          <Heading>
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            General
          </Heading>
        </Card.Header>
        <Card.Body>
          <GeneralEditForm subject={subject} />
        </Card.Body>
      </Card>
    );
  } else if (menu === "slot-templates") {
    return (
      <Card>
        <Card.Header className="flex justify-between">
          <Heading>
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Slots
          </Heading>
          <Button variant="primary" onClick={handleCreateSlot}>
            <FontAwesomeIcon icon={faAdd} className="mr-2" />
            Add Slot
          </Button>
        </Card.Header>
        <Card.Body>
          <List />
        </Card.Body>
      </Card>
    );
  }
}

function Wrapper({ children }) {
  const [subject, setSubject] = useState(null);
  const [slots, setSlots] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    subjectsService.getSubjectById(id).then(setSubject);
    getAllSlots.getAllSlots(id).then(setSlots);
  }, []);

  async function updateSubject({ name, semesterNumber }) {
    const subject = await subjectsService.updateSubject(id, { name, semesterNumber });
    setSubject(subject);
  }

  async function updateSlot(id, slot) {
    const updatedSlot = await getAllSlots.updateSlot(id, slot);
    setSlots(slots.map((s) => (s.id === id ? updatedSlot : s)));
  }

  async function createSlot() {
    const slot = await getAllSlots.createSlot(id);
    setSlots([...slots, slot]);
  }

  async function deleteSlot(id) {
    await getAllSlots.deleteSlot(id);
    setSlots(slots.filter((s) => s.id !== id));
  }

  return (
    <SubjectDetailContext.Provider value={{ slots, subject, updateSubject, createSlot, updateSlot, deleteSlot }}>
      {children}
    </SubjectDetailContext.Provider>
  );
}

export default function AdminSubjectDetailPage() {
  const [menu, setMenu] = useState("general");

  return (
    <Wrapper>
      <Link to="/admin/subjects" className="text-blue-500">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </Link>
      <main className="mt-3 grid grid-cols-[1fr_3fr] items-start mb-4 gap-3">
        <Card>
          <Card.Header>
            <Heading>
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Menu
            </Heading>
          </Card.Header>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item
                active={menu === "general"}
                onClick={() => setMenu("general")}
              >
                General
              </ListGroup.Item>
              <ListGroup.Item
                active={menu === "slot-templates"}
                onClick={() => setMenu("slot-templates")}
              >
                Slots
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        <Content menu={menu} />
      </main>
    </Wrapper>
  );
}
