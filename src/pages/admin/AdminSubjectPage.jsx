import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { useState, useEffect, createContext, useContext } from "react";
import { Col, Row, Table, Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faBook,
  faAdd
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";
import * as subjectsService from "../../services/subjects";
import { DomainError } from "../../services/errors";
import { Link } from "react-router-dom";

const SubjectsManagementContext = createContext();

const headers = [
  { title: "Subject Name", prop: "name", isFiterable: true, isSortable: true },
  { title: "Semester", prop: "semesterNumber", isFilterable: true, isSortable: true },
  {
    title: "Details",
    prop: "id",
    isSortable: false,
    cellProps: { className: "w-1 whitespace-nowrap" },
    cell({ id }) {
      return (
        <Link to={`/admin/subjects/${id}`}>
          <Button variant="primary">
            <FontAwesomeIcon icon={faPencil} /> Details
          </Button>
        </Link>
      );
    },
  },
];

function Wrapper({ children }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    subjectsService.getAll().then(setSubjects);
  }, []);

  async function createSubject({ name, semesterNumber }) {
    const subject = await subjectsService.createSubject({ name, semesterNumber });
    setSubjects([...subjects, subject]);
  }

  return (
    <SubjectsManagementContext.Provider
      value={{ subjects, createSubject }}
    >
      {children}
    </SubjectsManagementContext.Provider>
  );
}

function CreateSubjectDialog({ onDone, show }) {
  const [name, setName] = useState("");
  const [semesterNumber, setSemesterNumber] = useState("1");
  const [validated, setValidated] = useState(false);
  const { createSubject } = useContext(SubjectsManagementContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      await createSubject({ name, semesterNumber });
    } catch (err) {
      if (err instanceof DomainError) {
        alert(err.message);
        return;
      } else {
        throw err;
      }
    }

    onDone();
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Subject
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Subject Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Semester</Form.Label>
            <Form.Select
              onChange={(event) => setSemesterNumber(event.target.value)}
              value={semesterNumber}
            >
              {Array(9)
                .fill(0)
                .map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please provide a valid semester number.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onDone()}
          >
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}


function SubjectsTable() {
  const { subjects } = useContext(SubjectsManagementContext);
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);

  return (
    <>
      {showAddSubjectDialog && (
        <CreateSubjectDialog
          show={showAddSubjectDialog}
          onDone={() => setShowAddSubjectDialog(false)}
        />
      )}
      <DatatableWrapper
        body={subjects}
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
              Manage Subjects
            </h1>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4 align-items-end">
              <Col xs={5}>
                <Filter />
              </Col>
              <Col xs={5}>
                <PaginationOptions />
              </Col>
              <Col xs={2}>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowAddSubjectDialog(true)}
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add Subject
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

export default function AdminSubjectPage() {
  return (
    <Wrapper>
      <SubjectsTable />
    </Wrapper>
  );
}
