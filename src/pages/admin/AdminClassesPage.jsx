import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Col, Row, Table, Button, Card, Modal, Form, Tab, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faAdd
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import * as classesService from "../../services/classrooms";
import * as usersService from "../../services/users";
import * as subjectsService from "../../services/subjects";
import { DomainError } from "../../services/errors";

const AdminClassesContext = createContext();

function CreateClassModal({ onDone }) {
  const [validated, setValidated] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [studentsSelectionMap, setStudentsSelectionMap] = useState({});
  const { createClass } = useContext(AdminClassesContext);

  async function handleOnSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.target.checkValidity()) {
      return;
    }

    const studentIds = Object.keys(studentsSelectionMap).filter(
      (studentId) => studentsSelectionMap[studentId]
    );

    if (studentIds.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      await createClass({
        name,
        teacherId,
        subjectId,
        studentIds,
      });
    } catch (err) {
      if (err instanceof DomainError) {
        alert(err.message);
        return;
      } else {
        throw err;
      }
    }

    onDone();
  }

  useEffect(() => {
    usersService.getAllByRole("teacher").then(setTeachers);
    usersService.getAllByRole("student").then(setStudents);
    subjectsService.getAll().then(setSubjects);
  }, []);

  function toggle(studentId) {
    const newMap = { ...studentsSelectionMap };
    newMap[studentId] = studentsSelectionMap[studentId] ? false : true;
    setStudentsSelectionMap(newMap);
  }

  return (
    <Modal show={true}>
      <Modal.Header>
        <Modal.Title>Create Class</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Tabs defaultActiveKey="general" className="mb-3">
            <Tab eventKey="general" title="General">
              <Form.Group>
                <Form.Label>Class Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Class Name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Class name is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Select
                  required
                  onChange={(event) => setSubjectId(event.target.value)}
                  value={subjectId}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Subject is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Teacher</Form.Label>
                <Form.Select
                  required
                  onChange={(event) => setTeacherId(event.target.value)}
                  value={teacherId}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Teacher is required
                </Form.Control.Feedback>
              </Form.Group>
            </Tab>
            <Tab eventKey="students" title="Students">
              <Form.Group>
                <Form.Label>Student</Form.Label>
                {students.map((student) => (
                  <Form.Check
                    key={student.id}
                    type="checkbox"
                    label={student.username}
                    checked={studentsSelectionMap[student.id] ? true : false}
                    onChange={() => toggle(student.id)}
                  />
                ))}
              </Form.Group>
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => onDone()}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function Wrapper({ children }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    classesService.getAll().then(setClasses);
  }, []);

  async function createClass({ name, teacherId, subjectId, studentIds }) {
    const theClass = await classesService.createClass({
      name,
      teacherId,
      subjectId,
      studentIds
    });

    setClasses([...classes, theClass]);
  }


  return (
    <AdminClassesContext.Provider value={{ classes, createClass }}>
      {children}
    </AdminClassesContext.Provider>
  )
}

const headers = [
  { title: "Subject Name", prop: "subjectName", isSortable: true },
  { title: "Class Name", prop: "name", isFilterable: true, isSortable: true },
  { title: "Teacher Name", prop: "teacherName", isSortable: true },
  { title: "# Students", prop: "studentCount", isSortable: true }
];

function ClassesTable() {
  const { classes } = useContext(AdminClassesContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      { showModal && <CreateClassModal onDone={() => setShowModal(false)} /> }
      <DatatableWrapper
        body={classes}
        headers={headers}
        paginationOptionsProps={{
          initialState: {
            rowsPerPage: 10,
            options: [5, 10, 20, 50],
          },
        }}
      >
        <Card className="shadow min-h-[700px] max-h-[700px]">
          <Card.Header>
            <h1 className="font-bold text-2xl">
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              Manage Classes
            </h1>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4 align-items-end">
              <Col xs={5}>
                <Filter placeholder="Class Name" />
              </Col>
              <Col xs={5}>
                <PaginationOptions />
              </Col>
              <Col xs={2}>
                <Button variant="primary" className="w-full" onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add Class
                </Button>
              </Col>
            </Row>
            <Table striped hover>
              <TableHeader />
              <TableBody />
            </Table>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-center">
            <Pagination />
          </Card.Footer>
        </Card>
      </DatatableWrapper>
    </>
  );
}

export default function AdminClassesPage() {
  return (
    <Wrapper>
      <ClassesTable />
    </Wrapper>
  );
}
